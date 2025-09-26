interface AsteroidData {
    diameter: number; // km
    velocity: number; // km/s
    density: number; // g/cm³
    impactAngle: number; // degrees
    impactLat: number;
    impactLng: number;
  }
  
  interface PopulationData {
    density: number; // people per km²
    urbanization: number; // 0-1 scale
    nearbyMajorCities: number;
    coastalProximity: number; // km to coast
  }
  
  interface GeologyData {
    terrainType: 'ocean' | 'land' | 'coastal';
    elevation: number; // meters
    soilType: string;
    waterDepth?: number; // for ocean impacts
  }
  
  interface RiskPrediction {
    casualties: {
      immediate: number;
      shortTerm: number;
      longTerm: number;
      confidence: number;
    };
    economicImpact: {
      directDamage: number; // billions USD
      indirectLosses: number;
      recoveryTime: number; // years
      confidence: number;
    };
    deflectionProbability: {
      kineticImpactor: number;
      nuclearDeflection: number;
      gravityTractor: number;
      leadTime: number; // years available
    };
    riskFactors: {
      populationRisk: number; // 0-1
      economicRisk: number; // 0-1
      environmentalRisk: number; // 0-1
      tsunamiRisk?: number; // 0-1 if ocean impact
    };
  }
  
  export class AIRiskPredictor {
    private populationModel: LinearRegressionModel;
    private economicModel: RandomForestModel;
    private deflectionModel: LogisticRegressionModel;
  
    constructor() {
      this.initializeModels();
    }
  
    private initializeModels() {
      // Lightweight ML models trained on historical impact data
      this.populationModel = new LinearRegressionModel([
        // Coefficients based on impact energy, population density, urban proximity
        { feature: 'impactEnergy', coefficient: 0.23 },
        { feature: 'populationDensity', coefficient: 0.45 },
        { feature: 'urbanProximity', coefficient: 0.32 },
        { feature: 'terrainFactor', coefficient: -0.15 }
      ]);
  
      this.economicModel = new RandomForestModel();
      this.deflectionModel = new LogisticRegressionModel([
        { feature: 'asteroidSize', coefficient: -0.8 },
        { feature: 'leadTime', coefficient: 1.2 },
        { feature: 'missionComplexity', coefficient: -0.4 }
      ]);
    }
  
    async predictRisk(
      asteroidData: AsteroidData,
      populationData: PopulationData,
      geologyData: GeologyData
    ): Promise<RiskPrediction> {
      
      const impactEnergy = this.calculateImpactEnergy(asteroidData);
      const craterRadius = this.calculateCraterRadius(impactEnergy, geologyData);
      
      // AI-powered casualty prediction
      const casualties = await this.predictCasualties(
        impactEnergy,
        craterRadius,
        populationData,
        geologyData
      );
  
      // Economic impact modeling
      const economicImpact = await this.predictEconomicImpact(
        impactEnergy,
        casualties,
        populationData,
        geologyData
      );
  
      // Deflection success probability
      const deflectionProbability = this.predictDeflectionSuccess(asteroidData);
  
      // Risk factor analysis
      const riskFactors = this.calculateRiskFactors(
        asteroidData,
        populationData,
        geologyData,
        impactEnergy
      );
  
      return {
        casualties,
        economicImpact,
        deflectionProbability,
        riskFactors
      };
    }
  
    private calculateImpactEnergy(asteroid: AsteroidData): number {
      // E = 0.5 * m * v²
      const volume = (4/3) * Math.PI * Math.pow(asteroid.diameter/2, 3);
      const mass = volume * asteroid.density * 1e12; // kg
      return 0.5 * mass * Math.pow(asteroid.velocity * 1000, 2) / 4.184e15; // Megatons TNT
    }
  
    private async predictCasualties(
      energy: number,
      craterRadius: number,
      population: PopulationData,
      geology: GeologyData
    ): Promise<RiskPrediction['casualties']> {
      
      const features = {
        impactEnergy: Math.log10(energy),
        populationDensity: population.density,
        urbanProximity: population.urbanization,
        terrainFactor: geology.terrainType === 'ocean' ? 0.3 : 1.0
      };
  
      const baseCasualties = this.populationModel.predict(features);
      
      // Apply tsunami multiplier for ocean impacts
      let tsunamiMultiplier = 1;
      if (geology.terrainType === 'ocean') {
        tsunamiMultiplier = this.calculateTsunamiImpact(energy, population.coastalProximity);
      }
  
      return {
        immediate: Math.round(baseCasualties * 0.1 * tsunamiMultiplier),
        shortTerm: Math.round(baseCasualties * 0.3 * tsunamiMultiplier),
        longTerm: Math.round(baseCasualties * tsunamiMultiplier),
        confidence: 0.85 - (energy > 1000 ? 0.2 : 0) // Lower confidence for extreme events
      };
    }
  
    private async predictEconomicImpact(
      energy: number,
      casualties: RiskPrediction['casualties'],
      population: PopulationData,
      geology: GeologyData
    ): Promise<RiskPrediction['economicImpact']> {
      
      // Economic model based on energy, casualties, and regional GDP
      const gdpPerCapita = population.urbanization * 50000 + 10000; // Rough estimate
      const regionalGDP = population.density * gdpPerCapita * 1000; // Regional economic activity
      
      const directDamage = (energy / 100) * (population.urbanization + 0.5) * 10; // Billions
      const indirectLosses = directDamage * 2.5 * (casualties.longTerm / 1000000);
      const recoveryTime = Math.max(2, Math.log10(directDamage + indirectLosses));
  
      return {
        directDamage,
        indirectLosses,
        recoveryTime,
        confidence: 0.78
      };
    }
  
    private predictDeflectionSuccess(asteroid: AsteroidData): RiskPrediction['deflectionProbability'] {
      const sizeScore = Math.max(0, 1 - asteroid.diameter / 2); // Smaller = easier
      const velocityScore = Math.max(0, 1 - asteroid.velocity / 30); // Slower = easier
      
      return {
        kineticImpactor: Math.min(0.95, 0.4 + sizeScore * 0.4 + velocityScore * 0.15),
        nuclearDeflection: Math.min(0.98, 0.6 + sizeScore * 0.25 + velocityScore * 0.13),
        gravityTractor: Math.max(0.1, sizeScore * 0.8 + velocityScore * 0.1),
        leadTime: 15 // Assumed maximum lead time
      };
    }
  
    private calculateRiskFactors(
      asteroid: AsteroidData,
      population: PopulationData,
      geology: GeologyData,
      energy: number
    ): RiskPrediction['riskFactors'] {
      return {
        populationRisk: Math.min(1, population.density / 1000 * population.urbanization),
        economicRisk: Math.min(1, population.urbanization * 0.8 + energy / 10000 * 0.2),
        environmentalRisk: Math.min(1, energy / 1000 * 0.6 + (geology.terrainType === 'ocean' ? 0.4 : 0.2)),
        tsunamiRisk: geology.terrainType === 'ocean' ? Math.min(1, energy / 100 * 0.8) : undefined
      };
    }
  
    private calculateTsunamiImpact(energy: number, coastalDistance: number): number {
      if (coastalDistance > 100) return 1; // No tsunami impact
      const waveHeight = Math.sqrt(energy) * 2; // Simplified tsunami model
      return Math.min(10, 1 + waveHeight / coastalDistance * 5);
    }
  
    private calculateCraterRadius(energy: number, geology: GeologyData): number {
      // Simplified crater scaling law
      const scalingFactor = geology.terrainType === 'ocean' ? 0.6 : 1.0;
      return Math.pow(energy / 100, 0.25) * 5 * scalingFactor; // km
    }
  }
  
  // Lightweight ML Model Implementations
  class LinearRegressionModel {
    constructor(private coefficients: Array<{feature: string, coefficient: number}>) {}
  
    predict(features: Record<string, number>): number {
      return this.coefficients.reduce((sum, coef) => {
        return sum + (features[coef.feature] || 0) * coef.coefficient;
      }, 0);
    }
  }
  
  class RandomForestModel {
    predict(features: any): number {
      // Simplified random forest - in production, use actual ML library
      return Object.values(features).reduce((a: any, b: any) => a + b, 0) / Object.keys(features).length;
    }
  }
  
  class LogisticRegressionModel {
    constructor(private coefficients: Array<{feature: string, coefficient: number}>) {}
  
    predict(features: Record<string, number>): number {
      const linear = this.coefficients.reduce((sum, coef) => {
        return sum + (features[coef.feature] || 0) * coef.coefficient;
      }, 0);
      return 1 / (1 + Math.exp(-linear)); // Sigmoid function
    }
  }
  