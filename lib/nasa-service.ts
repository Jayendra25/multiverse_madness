// lib/nasa-service.ts
import { NASAAsteroid } from '../types/nasa';

export class NASAService {
  private apiKey: string | undefined = process.env.NEXT_PUBLIC_NASA_API_KEY;
  private baseUrl = 'https://api.nasa.gov/neo/rest/v1';

  async getNearEarthObjects(): Promise<NASAAsteroid[]> {
    try {
      if (!this.apiKey) {
        console.warn('NASA API key not found, using fallback data');
        return this.getFallbackAsteroids();
      }

      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `${this.baseUrl}/feed?start_date=${today}&end_date=${today}&api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }

      const data = await response.json();
      const asteroids = Object.values(data.near_earth_objects).flat() as NASAAsteroid[];

      if (asteroids.length === 0) {
        const browseResponse = await fetch(`${this.baseUrl}/neo/browse?api_key=${this.apiKey}`);
        const browseData = await browseResponse.json();
        return (browseData.near_earth_objects as NASAAsteroid[]).slice(0, 20);
      }

      return asteroids.slice(0, 20);
    } catch (error) {
      console.error('Failed to fetch NASA ', error);
      return this.getFallbackAsteroids();
    }
  }

  private getFallbackAsteroids(): NASAAsteroid[] {
    return [
      {
        id: "2000719",
        name: "719 Albert (1911 MT)",
        estimated_diameter: {
          meters: { estimated_diameter_min: 2400, estimated_diameter_max: 5400 }
        },
        close_approach_data: [
          {
            relative_velocity: { kilometers_per_second: "16.75" },
            miss_distance: { kilometers: "76000000" }
          }
        ],
        is_potentially_hazardous_asteroid: true
      },
      {
        id: "3542519",
        name: "(2010 PK9)",
        estimated_diameter: {
          meters: { estimated_diameter_min: 190, estimated_diameter_max: 430 }
        },
        close_approach_data: [
          {
            relative_velocity: { kilometers_per_second: "8.94" },
            miss_distance: { kilometers: "45000000" }
          }
        ],
        is_potentially_hazardous_asteroid: false
      },
      {
        id: "2099942",
        name: "99942 Apophis (2004 MN4)",
        estimated_diameter: {
          meters: { estimated_diameter_min: 310, estimated_diameter_max: 340 }
        },
        close_approach_data: [
          {
            relative_velocity: { kilometers_per_second: "7.42" },
            miss_distance: { kilometers: "31000000" }
          }
        ],
        is_potentially_hazardous_asteroid: true
      },
      {
        id: "3753",
        name: "3753 Cruithne (1986 TO)",
        estimated_diameter: {
          meters: { estimated_diameter_min: 5000, estimated_diameter_max: 5000 }
        },
        close_approach_data: [
          {
            relative_velocity: { kilometers_per_second: "19.33" },
            miss_distance: { kilometers: "12000000" }
          }
        ],
        is_potentially_hazardous_asteroid: false
      },
      {
        id: "1685",
        name: "1685 Toro (1948 OA)",
        estimated_diameter: {
          meters: { estimated_diameter_min: 3900, estimated_diameter_max: 8700 }
        },
        close_approach_data: [
          {
            relative_velocity: { kilometers_per_second: "14.25" },
            miss_distance: { kilometers: "18500000" }
          }
        ],
        is_potentially_hazardous_asteroid: true
      },
      {
        id: "433",
        name: "433 Eros (1898 DQ)",
        estimated_diameter: {
          meters: { estimated_diameter_min: 16840, estimated_diameter_max: 16840 }
        },
        close_approach_data: [
          {
            relative_velocity: { kilometers_per_second: "5.04" },
            miss_distance: { kilometers: "22100000" }
          }
        ],
        is_potentially_hazardous_asteroid: false
      },
      {
        id: "25143",
        name: "25143 Itokawa (1998 SF36)",
        estimated_diameter: {
          meters: { estimated_diameter_min: 294, estimated_diameter_max: 535 }
        },
        close_approach_data: [
          {
            relative_velocity: { kilometers_per_second: "25.46" },
            miss_distance: { kilometers: "19500000" }
          }
        ],
        is_potentially_hazardous_asteroid: false
      },
      {
        id: "101955",
        name: "101955 Bennu (1999 RQ36)",
        estimated_diameter: {
          meters: { estimated_diameter_min: 484, estimated_diameter_max: 565 }
        },
        close_approach_data: [
          {
            relative_velocity: { kilometers_per_second: "6.14" },
            miss_distance: { kilometers: "17500000" }
          }
        ],
        is_potentially_hazardous_asteroid: true
      }
    ];
  }
}
