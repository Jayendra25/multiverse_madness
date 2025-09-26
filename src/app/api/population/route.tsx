import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const radius = parseInt(searchParams.get("radius") || "100");

  try {
    // Try OpenStreetMap Nominatim API for location identification
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "DefendEarth-App/1.0",
        },
      }
    );

    if (nominatimResponse.ok) {
      const locationData = await nominatimResponse.json();

      // Estimate population density based on location
      const populationData = estimatePopulationFromLocation(
        locationData,
        lat,
        lng
      );

      return Response.json({
        ...populationData,
        locationName: locationData.display_name || "Unknown Location",
        source: "OpenStreetMap",
      });
    }
  } catch (error) {
    console.warn("Nominatim API failed, using fallback ", error);
  }

  // Fallback population estimation
  const fallbackData = generateFallbackPopulationData(lat, lng);
  return Response.json({
    ...fallbackData,
    source: "fallback",
  });
}

function estimatePopulationFromLocation(
  locationData: any,
  lat: number,
  lng: number
) {
  let density = 100; // rural default
  let urbanization = 0.2;
  let nearbyMajorCities = 1;

  if (locationData.address) {
    const address = locationData.address;

    // Check for major cities
    const displayName = locationData.display_name.toLowerCase();
    const majorCities = [
      "new york",
      "los angeles",
      "chicago",
      "london",
      "tokyo",
      "paris",
      "berlin",
      "sydney",
    ];
    const isMajorCity = majorCities.some((city) => displayName.includes(city));

    if (isMajorCity) {
      density = 8000 + Math.random() * 4000;
      urbanization = 0.9;
      nearbyMajorCities = 4;
    } else if (address.city || address.town) {
      density = 1500 + Math.random() * 2500;
      urbanization = 0.7;
      nearbyMajorCities = 2;
    } else if (address.village) {
      density = 200 + Math.random() * 500;
      urbanization = 0.3;
      nearbyMajorCities = 1;
    }
  }

  return {
    density: Math.round(density),
    urbanization: Math.round(urbanization * 100) / 100,
    nearbyMajorCities,
    coastalProximity: calculateCoastalDistance(lat, lng),
  };
}

function generateFallbackPopulationData(lat: number, lng: number) {
  // Generate realistic population data based on coordinates
  const knownUrbanAreas = [
    {
      lat: 40.7,
      lng: -74.0,
      density: 10000,
      name: "NYC Area",
      urbanization: 0.9,
    },
    {
      lat: 34.0,
      lng: -118.2,
      density: 3000,
      name: "LA Area",
      urbanization: 0.85,
    },
    {
      lat: 51.5,
      lng: -0.1,
      density: 5500,
      name: "London Area",
      urbanization: 0.88,
    },
    {
      lat: 35.7,
      lng: 139.7,
      density: 6200,
      name: "Tokyo Area",
      urbanization: 0.92,
    },
  ];

  // Find nearest urban area
  let density = 150; // rural default
  let urbanization = 0.2;
  let locationName = "Unknown Location";

  const nearestUrban = knownUrbanAreas.reduce(
    (closest, area) => {
      const distance = Math.sqrt(
        Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2)
      );
      return distance < closest.distance
        ? { ...area, distance, urbanization: area.urbanization }
        : closest;
    },
    { distance: Infinity, density: 150, name: "Rural Area", urbanization: 0.2 }
  );

  if (nearestUrban.distance < 1) {
    // Within ~100km
    density = nearestUrban.density * (1 - nearestUrban.distance);
    urbanization = 0.8;
    locationName = nearestUrban.name;
  } else if (nearestUrban.distance < 3) {
    density = nearestUrban.density * 0.3;
    urbanization = 0.5;
    locationName = `Near ${nearestUrban.name}`;
  }

  return {
    density: Math.round(density),
    urbanization: Math.round(urbanization * 100) / 100,
    nearbyMajorCities: urbanization > 0.7 ? 3 : urbanization > 0.4 ? 2 : 1,
    coastalProximity: calculateCoastalDistance(lat, lng),
    locationName,
  };
}

function calculateCoastalDistance(lat: number, lng: number): number {
  // Same function as in geology route
  const coastalRegions = [
    { lat: 40.7, lng: -74.0, distance: 5 },
    { lat: 34.0, lng: -118.2, distance: 20 },
    { lat: 51.5, lng: -0.1, distance: 50 },
    { lat: 35.0, lng: 139.7, distance: 10 },
  ];

  const nearest = coastalRegions.reduce((closest, coast) => {
    const distance =
      Math.sqrt(Math.pow(lat - coast.lat, 2) + Math.pow(lng - coast.lng, 2)) *
      111;
    return distance < closest ? distance : closest;
  }, 1000);

  return Math.min(nearest, Math.random() * 200 + 10);
}
