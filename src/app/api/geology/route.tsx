import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  
  try {
    // Try USGS Elevation API from server side (no CORS issues)
    const elevationResponse = await fetch(
      `https://nationalmap.gov/epqs/pqs.php?x=${lng}&y=${lat}&units=Meters&output=json`,
      {
        headers: {
          'User-Agent': 'DefendEarth-App/1.0',
        },
      }
    );
    
    if (elevationResponse.ok) {
      const elevationData = await elevationResponse.json();
      const elevation = elevationData.USGS_Elevation_Point_Query_Service?.Elevation_Query?.Elevation || 0;
      
      // Calculate terrain type and other properties
      const isNearCoast = calculateCoastalDistance(lat, lng) < 10;
      const terrainType = elevation < 0 ? 'ocean' : isNearCoast ? 'coastal' : 'land';
      
      return Response.json({
        terrainType,
        elevation: Math.abs(elevation),
        soilType: elevation < 100 ? 'sedimentary' : 'mixed',
        waterDepth: elevation < 0 ? Math.abs(elevation) : undefined,
        source: 'USGS'
      });
    }
  } catch (error) {
    console.warn('USGS API failed, using fallback ', error);
  }
  
  // Fallback data if USGS fails
  const fallbackData = generateFallbackGeologyData(lat, lng);
  return Response.json({
    ...fallbackData,
    source: 'fallback'
  });
}

function calculateCoastalDistance(lat: number, lng: number): number {
  // Simplified coastal distance calculation
  const coastalRegions = [
    { lat: 40.7, lng: -74.0, distance: 5 }, // NYC area
    { lat: 34.0, lng: -118.2, distance: 20 }, // LA area  
    { lat: 51.5, lng: -0.1, distance: 50 }, // London area
    { lat: 35.0, lng: 139.7, distance: 10 }, // Tokyo area
  ];
  
  const nearest = coastalRegions.reduce((closest, coast) => {
    const distance = Math.sqrt(
      Math.pow(lat - coast.lat, 2) + Math.pow(lng - coast.lng, 2)
    ) * 111; // Rough km conversion
    return distance < closest ? distance : closest;
  }, 1000);
  
  return Math.min(nearest, Math.random() * 200 + 10);
}

function generateFallbackGeologyData(lat: number, lng: number) {
  // Generate realistic fallback data based on coordinates
  const isOceanic = Math.abs(lat) < 60 && (Math.abs(lng) > 160 || (lng > -160 && lng < -120));
  const isCoastal = !isOceanic && calculateCoastalDistance(lat, lng) < 50;
  
  let elevation, terrainType, soilType;
  
  if (isOceanic) {
    elevation = Math.random() * 4000 + 1000; // Ocean depth
    terrainType = 'ocean';
    soilType = 'oceanic';
  } else if (isCoastal) {
    elevation = Math.random() * 100 + 5; // Low coastal elevation
    terrainType = 'coastal';
    soilType = 'sedimentary';
  } else {
    elevation = Math.random() * 2000 + 100; // Inland elevation
    terrainType = 'land';
    soilType = Math.random() > 0.5 ? 'mixed' : 'sedimentary';
  }
  
  return {
    terrainType,
    elevation,
    soilType,
    waterDepth: terrainType === 'ocean' ? elevation : undefined
  };
}
