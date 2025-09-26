// types/nasa.ts
export interface NASAAsteroid {
    id: string;
    name: string;
    estimated_diameter: {
      meters: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
    };
    close_approach_data: Array<{
      relative_velocity: {
        kilometers_per_second: string;
      };
      miss_distance: {
        kilometers: string;
      };
    }>;
    is_potentially_hazardous_asteroid: boolean;
  }
  