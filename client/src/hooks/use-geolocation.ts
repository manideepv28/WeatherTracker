import { useState, useEffect } from "react";
import { GeolocationCoords } from "@/types/weather";

interface UseGeolocationResult {
  coords: GeolocationCoords | null;
  error: string | null;
  loading: boolean;
  getCurrentLocation: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [coords, setCoords] = useState<GeolocationCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Location access denied. Please enable location permissions.");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("Unable to retrieve your location.");
            break;
        }
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  return { coords, error, loading, getCurrentLocation };
}
