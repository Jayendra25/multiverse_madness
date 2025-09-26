'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, AlertTriangle, TrendingUp, Shield, Users, DollarSign, Globe, Waves, Loader2 } from 'lucide-react'
import { AIRiskPredictor } from '../../../lib/ai-risk-predictor'
import { DataIntegrationService } from '../../../lib/data-integration'
import Interactive3DEarth from './Interactive3DEarth'
import ImpactAnalysisDisplay from './ImpactAnalysisDisplay'

interface RiskMetrics {
  casualties: {
    immediate: number;
    shortTerm: number;
    longTerm: number;
    confidence: number;
  };
  economicImpact: {
    directDamage: number;
    indirectLosses: number;
    recoveryTime: number;
    confidence: number;
  };
  deflectionProbability: {
    kineticImpactor: number;
    nuclearDeflection: number;
    gravityTractor: number;
    leadTime: number;
  };
  riskFactors: {
    populationRisk: number;
    economicRisk: number;
    environmentalRisk: number;
    tsunamiRisk?: number;
  };
}

interface ScenarioInfo {
  asteroidName: string;
  locationName: string;
  isRealData: boolean;
}

export default function AIRiskDashboard() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [scenarioInfo, setScenarioInfo] = useState<ScenarioInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('urban-impact');
  const [error, setError] = useState<string | null>(null);
  
  // New state for interactive Earth
  const [interactiveData, setInteractiveData] = useState(null);
  const [currentView, setCurrentView] = useState<'scenarios' | 'interactive'>('interactive');

  const predictor = new AIRiskPredictor();
  const dataService = new DataIntegrationService();

  const runRiskAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Scenario coordinates and settings
      const scenarios = {
        'urban-impact': { 
          lat: 40.7128, 
          lng: -74.0060, 
          name: 'New York City',
          description: 'Dense urban center with high economic activity'
        },
        'ocean-impact': { 
          lat: 35.0, 
          lng: -150.0, 
          name: 'Pacific Ocean',
          description: 'Deep ocean impact with tsunami potential'
        },
        'rural-impact': { 
          lat: 39.8283, 
          lng: -98.5795, 
          name: 'Kansas Plains',
          description: 'Rural agricultural region with low population density'
        }
      };
      
      const coords = scenarios[selectedScenario as keyof typeof scenarios];
      
      // Fetch real NASA asteroid data
      console.log('Fetching NASA asteroid data...');
      const asteroidData = await dataService.fetchNASAAsteroidData();
      
      // Fetch real population and geology data
      console.log('Fetching population and geology data...');
      const [populationData, geologyData] = await Promise.all([
        dataService.fetchPopulationData(coords.lat, coords.lng),
        dataService.fetchGeologyData(coords.lat, coords.lng)
      ]);
      
      console.log('Running AI risk prediction...');
      // Run AI prediction with real data
      const prediction = await predictor.predictRisk(
        { 
          ...asteroidData, 
          impactLat: coords.lat, 
          impactLng: coords.lng 
        },
        populationData,
        geologyData
      );
      
      // Set scenario information
      setScenarioInfo({
        asteroidName: asteroidData.name || 'Unknown Asteroid',
        locationName: populationData.locationName || coords.name,
        isRealData: asteroidData.id !== 'SIM-001' // Check if using real data
      });
      
      setRiskMetrics(prediction);
      
    } catch (error) {
      console.error('Risk analysis error:', error);
      setError('Failed to fetch real-time data. Using simulation data for demonstration.');
      
      // Fallback to demo data
      const fallbackData = await runFallbackAnalysis(selectedScenario);
      setRiskMetrics(fallbackData.metrics);
      setScenarioInfo(fallbackData.info);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runFallbackAnalysis = async (scenario: string) => {
    // Fallback demo data based on scenario
    const scenarios = {
      'urban-impact': {
        asteroidData: {
          diameter: 0.8,
          velocity: 25,
          density: 2.6,
          impactAngle: 45,
          impactLat: 40.7128,
          impactLng: -74.0060
        },
        populationData: {
          density: 12000,
          urbanization: 0.95,
          nearbyMajorCities: 5,
          coastalProximity: 2,
          locationName: 'New York City Metro Area'
        },
        geologyData: {
          terrainType: 'coastal' as const,
          elevation: 15,
          soilType: 'urban',
          waterDepth: undefined
        },
        info: {
          asteroidName: 'Demo Asteroid NYC-2025',
          locationName: 'New York City Metro Area',
          isRealData: false
        }
      },
      'ocean-impact': {
        asteroidData: {
          diameter: 1.2,
          velocity: 30,
          density: 3.2,
          impactAngle: 60,
          impactLat: 35.0,
          impactLng: -150.0
        },
        populationData: {
          density: 0,
          urbanization: 0.0,
          nearbyMajorCities: 0,
          coastalProximity: 0,
          locationName: 'North Pacific Ocean'
        },
        geologyData: {
          terrainType: 'ocean' as const,
          elevation: -4000,
          soilType: 'oceanic',
          waterDepth: 4000
        },
        info: {
          asteroidName: 'Demo Asteroid PAC-2025',
          locationName: 'North Pacific Ocean',
          isRealData: false
        }
      },
      'rural-impact': {
        asteroidData: {
          diameter: 0.6,
          velocity: 18,
          density: 2.4,
          impactAngle: 35,
          impactLat: 39.8283,
          impactLng: -98.5795
        },
        populationData: {
          density: 35,
          urbanization: 0.15,
          nearbyMajorCities: 1,
          coastalProximity: 800,
          locationName: 'Kansas Agricultural Region'
        },
        geologyData: {
          terrainType: 'land' as const,
          elevation: 550,
          soilType: 'sedimentary',
          waterDepth: undefined
        },
        info: {
          asteroidName: 'Demo Asteroid KAN-2025',
          locationName: 'Kansas Agricultural Region',
          isRealData: false
        }
      }
    };

    const scenarioData = scenarios[scenario as keyof typeof scenarios];
    const prediction = await predictor.predictRisk(
      scenarioData.asteroidData,
      scenarioData.populationData,
      scenarioData.geologyData
    );

    return {
      metrics: prediction,
      info: scenarioData.info
    };
  };

  useEffect(() => {
    if (currentView === 'scenarios') {
      runRiskAnalysis();
    }
  }, [selectedScenario, currentView]);

  if (isAnalyzing) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="flex flex-col items-center justify-center min-h-96">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
          <h3 className="text-2xl font-bold text-purple-300 mb-2">AI Analysis in Progress</h3>
          <p className="text-gray-400 text-center max-w-md">
            Fetching real-time NASA data and running machine learning predictions...
          </p>
          <div className="mt-6 flex space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center mb-4">
          <Brain className="w-12 h-12 text-purple-400 mr-4" />
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI Risk Prediction Engine
            </span>
          </h1>
        </div>
        <p className="text-gray-300 text-lg">
          Machine learning powered analysis of asteroid impact consequences
        </p>
        
        {/* Data Source Indicator */}
        {scenarioInfo && currentView === 'scenarios' && (
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
            <div className={`px-3 py-1 rounded-full ${scenarioInfo.isRealData ? 'bg-green-500/20 text-green-300' : 'bg-orange-500/20 text-orange-300'}`}>
              {scenarioInfo.isRealData ? '🛰️ Live NASA Data' : '🎯 Demo Data'}
            </div>
            <div className="text-gray-400">
              Asteroid: <span className="text-white">{scenarioInfo.asteroidName}</span>
            </div>
            <div className="text-gray-400">
              Location: <span className="text-white">{scenarioInfo.locationName}</span>
            </div>
          </div>
        )}
        
        {/* Error Indicator */}
        {error && currentView === 'scenarios' && (
          <div className="mt-4 bg-orange-500/20 border border-orange-500/50 rounded-lg p-3 text-orange-300 text-sm">
            ⚠️ {error}
          </div>
        )}
      </motion.div>

      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-center">
          <div className="bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
            <button
              onClick={() => setCurrentView('interactive')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentView === 'interactive'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🌍 Interactive Earth
            </button>
            <button
              onClick={() => setCurrentView('scenarios')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentView === 'scenarios'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              📊 Scenario Analysis
            </button>
          </div>
        </div>
      </motion.div>

      {/* Interactive Earth Section */}
      {currentView === 'interactive' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-2xl font-bold text-center mb-6 text-blue-400">
              🌍 Interactive Impact Simulator
            </h3>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 3D Earth */}
              <div>
                <Interactive3DEarth onImpactAnalysis={setInteractiveData} />
              </div>
              
              {/* Analysis Display */}
              <div>
                <ImpactAnalysisDisplay data={interactiveData} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Scenario Analysis Section */}
      {currentView === 'scenarios' && (
        <>
          {/* Scenario Selector */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { id: 'urban-impact', label: 'Urban Impact (NYC)', icon: '🏙️' },
                { id: 'ocean-impact', label: 'Ocean Impact (Pacific)', icon: '🌊' },
                { id: 'rural-impact', label: 'Rural Impact (Plains)', icon: '🌾' }
              ].map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  disabled={isAnalyzing}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedScenario === scenario.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {scenario.icon} {scenario.label}
                </button>
              ))}
            </div>
          </div>

          {riskMetrics && (
            <>
              {/* Risk Metrics Grid */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Casualty Predictions */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-2xl p-6 border border-red-500/30"
                >
                  <div className="flex items-center mb-6">
                    <Users className="w-8 h-8 text-red-400 mr-3" />
                    <div>
                      <h3 className="text-2xl font-bold text-red-300">Casualty Prediction</h3>
                      <p className="text-sm text-gray-400">AI Confidence: {(riskMetrics.casualties.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Immediate Deaths:</span>
                      <span className="text-2xl font-bold text-red-400">
                        {riskMetrics.casualties.immediate.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Short-term (1 week):</span>
                      <span className="text-xl font-bold text-orange-400">
                        {riskMetrics.casualties.shortTerm.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Long-term (1 year):</span>
                      <span className="text-xl font-bold text-yellow-400">
                        {riskMetrics.casualties.longTerm.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Economic Impact */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-2xl p-6 border border-green-500/30"
                >
                  <div className="flex items-center mb-6">
                    <DollarSign className="w-8 h-8 text-green-400 mr-3" />
                    <div>
                      <h3 className="text-2xl font-bold text-green-300">Economic Impact</h3>
                      <p className="text-sm text-gray-400">AI Confidence: {(riskMetrics.economicImpact.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Direct Damage:</span>
                      <span className="text-2xl font-bold text-green-400">
                        ${riskMetrics.economicImpact.directDamage.toFixed(1)}B
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Indirect Losses:</span>
                      <span className="text-xl font-bold text-yellow-400">
                        ${riskMetrics.economicImpact.indirectLosses.toFixed(1)}B
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Recovery Time:</span>
                      <span className="text-xl font-bold text-orange-400">
                        {riskMetrics.economicImpact.recoveryTime.toFixed(1)} years
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Deflection Success Probabilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-2xl p-6 border border-blue-500/30 mb-8"
              >
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold text-blue-300">Defense Success Probability</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { method: 'Kinetic Impactor', probability: riskMetrics.deflectionProbability.kineticImpactor, color: 'text-orange-400' },
                    { method: 'Nuclear Deflection', probability: riskMetrics.deflectionProbability.nuclearDeflection, color: 'text-red-400' },
                    { method: 'Gravity Tractor', probability: riskMetrics.deflectionProbability.gravityTractor, color: 'text-purple-400' }
                  ].map((method) => (
                    <div key={method.method} className="text-center">
                      <div className="text-sm text-gray-400 mb-2">{method.method}</div>
                      <div className={`text-3xl font-bold ${method.color} mb-2`}>
                        {(method.probability * 100).toFixed(1)}%
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${
                            method.probability > 0.8 ? 'from-green-500 to-green-400' :
                            method.probability > 0.6 ? 'from-yellow-500 to-yellow-400' :
                            'from-red-500 to-red-400'
                          }`}
                          style={{ width: `${method.probability * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Risk Factor Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl p-6 border border-purple-500/30"
              >
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-purple-400 mr-3" />
                  <h3 className="text-2xl font-bold text-purple-300">Multidimensional Risk Analysis</h3>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { factor: 'Population Risk', value: riskMetrics.riskFactors.populationRisk, icon: Users, color: 'text-red-400' },
                    { factor: 'Economic Risk', value: riskMetrics.riskFactors.economicRisk, icon: DollarSign, color: 'text-green-400' },
                    { factor: 'Environmental Risk', value: riskMetrics.riskFactors.environmentalRisk, icon: Globe, color: 'text-blue-400' },
                    ...(riskMetrics.riskFactors.tsunamiRisk ? [{ factor: 'Tsunami Risk', value: riskMetrics.riskFactors.tsunamiRisk, icon: Waves, color: 'text-cyan-400' }] : [])
                  ].map((risk) => (
                    <div key={risk.factor} className="text-center">
                      <risk.icon className={`w-8 h-8 ${risk.color} mx-auto mb-2`} />
                      <div className="text-sm text-gray-400 mb-2">{risk.factor}</div>
                      <div className={`text-2xl font-bold ${risk.color} mb-2`}>
                        {(risk.value * 100).toFixed(0)}%
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            risk.value > 0.8 ? 'bg-red-500' :
                            risk.value > 0.5 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${risk.value * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-gradient-to-br from-gray-800/50 to-gray-700/30 rounded-2xl p-6 border border-gray-600/50"
              >
                <div className="flex items-center mb-4">
                  <Brain className="w-6 h-6 text-purple-400 mr-2" />
                  <h4 className="text-xl font-bold text-purple-300">AI Insights & Recommendations</h4>
                </div>
                <div className="text-gray-300 leading-relaxed">
                  <p className="mb-2">
                    🎯 <strong>Optimal Defense Strategy:</strong> {
                      riskMetrics.deflectionProbability.nuclearDeflection > riskMetrics.deflectionProbability.kineticImpactor 
                        ? `Nuclear deflection shows highest success probability (${(riskMetrics.deflectionProbability.nuclearDeflection * 100).toFixed(1)}%)`
                        : `Kinetic impactor shows highest success probability (${(riskMetrics.deflectionProbability.kineticImpactor * 100).toFixed(1)}%)`
                    } for this scenario
                  </p>
                  <p className="mb-2">
                    ⚠️ <strong>Critical Risk Factors:</strong> {
                      riskMetrics.riskFactors.populationRisk > 0.7 
                        ? 'High population density increases casualty projections significantly'
                        : riskMetrics.riskFactors.tsunamiRisk && riskMetrics.riskFactors.tsunamiRisk > 0.5
                        ? 'Ocean impact creates significant tsunami risk for coastal populations'
                        : 'Lower population density reduces immediate casualty risk'
                    }
                  </p>
                  <p>
                    🕒 <strong>Time Sensitivity:</strong> Early detection and {riskMetrics.deflectionProbability.leadTime}-year lead time are crucial for mission success
                  </p>
                  {scenarioInfo && !scenarioInfo.isRealData && (
                    <p className="mt-4 text-orange-300 text-sm">
                      💡 <strong>Note:</strong> This analysis uses demonstration data. With a NASA API key, real-time asteroid data would be used for more accurate predictions.
                    </p>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </>
      )}

      {/* No data message for scenarios */}
      {currentView === 'scenarios' && !riskMetrics && !isAnalyzing && (
        <div className="text-center text-gray-400 py-8">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg">No scenario data available</p>
          <p className="text-sm">Please select a scenario to begin analysis</p>
        </div>
      )}
    </div>
  );
}
