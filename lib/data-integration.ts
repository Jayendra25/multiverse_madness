export class DataIntegrationService {
  private nasaApiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
  private worldPopKey = process.env.WORLDPOP_API_KEY;

  async fetchNASAAsteroidData(asteroidId?: string) {
    try {
      // If no specific asteroid, get recent close approaches
      const endpoint = asteroidId 
        ? `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${this.nasaApiKey}`
        : `https://api.nasa.gov/neo/rest/v1/feed?start_date=${this.getDateString()}&end_date=${this.getDateString()}&api_key=${this.nasaApiKey}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (asteroidId) {
        return this.parseAsteroidData(data);
      } else {
        // Get the first asteroid from today's feed
        const today = this.getDateString();
        const asteroids = data.near_earth_objects[today] || [];
        return asteroids.length > 0 ? this.parseAsteroidData(asteroids[0]) : this.getDefaultAsteroid();
      }
    } catch (error) {
      console.error('NASA API Error:', error);
      return this.getDefaultAsteroid(); // Fallback data
    }
  }

  private parseAsteroidData(nasaData: any) {
    const diameter = nasaData.estimated_diameter?.kilometers?.estimated_diameter_max || 0.5;
    const closeApproach = nasaData.close_approach_data?.[0];
    const velocity = parseFloat(closeApproach?.relative_velocity?.kilometers_per_second) || 20;
    
    return {
      diameter,
      velocity,
      density: 2.6, // Typical rocky asteroid density
      impactAngle: 45, // Average impact angle
      name: nasaData.name || 'Unknown Asteroid',
      id: nasaData.id
    };
  }

  private getDefaultAsteroid() {
    // Fallback data if APIs fail
    return {
      diameter: 0.5,
      velocity: 20,
      density: 2.6,
      impactAngle: 45,
      name: 'Simulated Asteroid',
      id: 'SIM-001'
    };
  }

  async fetchPopulationData(lat: number, lng: number, radius: number = 100) {
    try {
      // Try multiple sources for population data
      
      // Option 1: Use Nominatim for city identification + estimated density
      const cityResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const cityData = await cityResponse.json();
      
      // Estimate population density based on location type
      let density = 100; // rural default
      let urbanization = 0.2;
      
      if (cityData.address) {
        if (cityData.address.city || cityData.address.town) {
          density = 2000;
          urbanization = 0.7;
        }
        if (cityData.address.state && ['New York', 'California', 'Tokyo', 'London'].some(major => 
            cityData.display_name.includes(major))) {
          density = 8000;
          urbanization = 0.9;
        }
      }

      return {
        density,
        urbanization,
        nearbyMajorCities: Math.floor(Math.random() * 3) + 1,
        coastalProximity: this.calculateCoastalDistance(lat, lng),
        locationName: cityData.display_name || 'Unknown Location'
      };
      
    } catch (error) {
      console.error('Population API Error:', error);
      // Return reasonable defaults
      return {
        density: 1000,
        urbanization: 0.5,
        nearbyMajorCities: 1,
        coastalProximity: 50,
        locationName: 'Unknown Location'
      };
    }
  }

  async fetchGeologyData(lat: number, lng: number) {
    try {
      // USGS Elevation API (free, no key required)
      const elevationResponse = await fetch(
        `https://nationalmap.gov/epqs/pqs.php?x=${lng}&y=${lat}&units=Meters&output=json`
      );
      const elevationData = await elevationResponse.json();
      const elevation = elevationData.USGS_Elevation_Point_Query_Service?.Elevation_Query?.Elevation || 0;
      
      // Determine terrain type based on coordinates and elevation
      const isNearCoast = this.calculateCoastalDistance(lat, lng) < 10;
      const terrainType = elevation < 0 ? 'ocean' : isNearCoast ? 'coastal' : 'land';
      
      return {
        terrainType,
        elevation: Math.abs(elevation),
        soilType: elevation < 100 ? 'sedimentary' : 'mixed',
        waterDepth: elevation < 0 ? Math.abs(elevation) : undefined
      };
      
    } catch (error) {
      console.error('Geology API Error:', error);
      return {
        terrainType: 'land' as const,
        elevation: 100,
        soilType: 'mixed',
        waterDepth: undefined
      };
    }
  }

  private calculateCoastalDistance(lat: number, lng: number): number {
    // Simplified coastal distance calculation
    // In production, use proper geographic libraries
    const coastalRegions = [
      { lat: 40.7, lng: -74.0, distance: 5 }, // NYC area
      { lat: 34.0, lng: -118.2, distance: 20 }, // LA area
      { lat: 51.5, lng: -0.1, distance: 50 }, // London area
    ];
    
    const nearest = coastalRegions.reduce((closest, coast) => {
      const distance = Math.sqrt(
        Math.pow(lat - coast.lat, 2) + Math.pow(lng - coast.lng, 2)
      ) * 111; // Rough km conversion
      return distance < closest ? distance : closest;
    }, 1000);
    
    return Math.min(nearest, Math.random() * 200 + 10);
  }

  private getDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
