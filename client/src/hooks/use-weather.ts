import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WeatherData, WeatherLocation, GeolocationCoords } from "@/types/weather";
import { getCurrentWeather, getWeatherByLocation, searchLocations } from "@/lib/weather-api";

export function useCurrentWeather(coords: GeolocationCoords | null) {
  return useQuery({
    queryKey: ["weather", "current", coords?.lat, coords?.lon],
    queryFn: () => coords ? getCurrentWeather(coords.lat, coords.lon) : Promise.resolve(null),
    enabled: !!coords,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useWeatherByLocation(location: WeatherLocation | null) {
  return useQuery({
    queryKey: ["weather", "location", location?.id],
    queryFn: () => location ? getWeatherByLocation(location) : Promise.resolve(null),
    enabled: !!location,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useLocationSearch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: searchLocations,
    onSuccess: (data) => {
      // Cache search results
      data.forEach((location) => {
        queryClient.setQueryData(["location", location.id], location);
      });
    },
  });
}

export function useRefreshWeather() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coords: GeolocationCoords) => {
      await queryClient.invalidateQueries({ queryKey: ["weather"] });
      return getCurrentWeather(coords.lat, coords.lon);
    },
  });
}
