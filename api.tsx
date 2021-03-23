import { Location } from "./Location";

export const getLocationByCoordinate = async (
  lat: string,
  lng: string,
): Promise<Location> => {
  try {
    let response = await fetch(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=SA2TL4ZX91BS&format=json&by=position&lat=${lat}&lng=${lng}"&country=US`,
    );
    let data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};
