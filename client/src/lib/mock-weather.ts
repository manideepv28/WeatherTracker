import { WeatherData, WeatherLocation } from "@/types/weather";

// Mock weather data for demo purposes when API key is not available
export const mockWeatherData: WeatherData = {
  current: {
    location: {
      id: "demo-location",
      name: "New York",
      country: "US",
      lat: 40.7128,
      lon: -74.0060,
    },
    temperature: 72,
    feelsLike: 75,
    description: "partly cloudy",
    icon: "02d",
    humidity: 65,
    windSpeed: 8,
    windDirection: 180,
    pressure: 1013,
    visibility: 10,
    uvIndex: 6,
    sunrise: Date.now() / 1000 - 3600,
    sunset: Date.now() / 1000 + 7200,
    lastUpdated: Date.now(),
  },
  daily: [
    {
      date: new Date().toDateString(),
      dayName: "Today",
      high: 78,
      low: 65,
      description: "partly cloudy",
      icon: "02d",
      precipitationChance: 20,
    },
    {
      date: new Date(Date.now() + 86400000).toDateString(),
      dayName: "Tomorrow",
      high: 75,
      low: 62,
      description: "sunny",
      icon: "01d",
      precipitationChance: 5,
    },
    {
      date: new Date(Date.now() + 172800000).toDateString(),
      dayName: "Wednesday",
      high: 80,
      low: 68,
      description: "light rain",
      icon: "10d",
      precipitationChance: 80,
    },
    {
      date: new Date(Date.now() + 259200000).toDateString(),
      dayName: "Thursday",
      high: 73,
      low: 60,
      description: "cloudy",
      icon: "04d",
      precipitationChance: 30,
    },
    {
      date: new Date(Date.now() + 345600000).toDateString(),
      dayName: "Friday",
      high: 76,
      low: 63,
      description: "sunny",
      icon: "01d",
      precipitationChance: 10,
    },
    {
      date: new Date(Date.now() + 432000000).toDateString(),
      dayName: "Saturday",
      high: 82,
      low: 70,
      description: "partly cloudy",
      icon: "02d",
      precipitationChance: 15,
    },
    {
      date: new Date(Date.now() + 518400000).toDateString(),
      dayName: "Sunday",
      high: 79,
      low: 67,
      description: "thunderstorm",
      icon: "11d",
      precipitationChance: 90,
    },
  ],
  hourly: Array.from({ length: 8 }, (_, i) => ({
    time: Math.floor(Date.now() / 1000) + i * 3600,
    temperature: 70 + Math.random() * 10,
    description: "partly cloudy",
    icon: "02d",
    precipitationChance: Math.floor(Math.random() * 30),
  })),
};

export const mockLocations: WeatherLocation[] = [
  { id: "1", name: "New York", country: "US", lat: 40.7128, lon: -74.0060 },
  { id: "2", name: "Los Angeles", country: "US", lat: 34.0522, lon: -118.2437 },
  { id: "3", name: "Chicago", country: "US", lat: 41.8781, lon: -87.6298 },
  { id: "4", name: "Miami", country: "US", lat: 25.7617, lon: -80.1918 },
  { id: "5", name: "London", country: "GB", lat: 51.5074, lon: -0.1278 },
  { id: "6", name: "Paris", country: "FR", lat: 48.8566, lon: 2.3522 },
  { id: "7", name: "Tokyo", country: "JP", lat: 35.6762, lon: 139.6503 },
  { id: "8", name: "Sydney", country: "AU", lat: -33.8688, lon: 151.2093 },
];

export function searchMockLocations(query: string): WeatherLocation[] {
  if (!query || query.length < 3) return [];
  return mockLocations.filter(location => 
    location.name.toLowerCase().includes(query.toLowerCase()) ||
    location.country.toLowerCase().includes(query.toLowerCase())
  );
}

export function getMockWeatherForLocation(location: WeatherLocation): WeatherData {
  // Simulate different weather for different locations
  const baseTemp = 60 + Math.random() * 40;
  return {
    ...mockWeatherData,
    current: {
      ...mockWeatherData.current,
      location,
      temperature: Math.round(baseTemp),
      feelsLike: Math.round(baseTemp + (Math.random() - 0.5) * 6),
      lastUpdated: Date.now(),
    },
    hourly: mockWeatherData.hourly.map(hour => ({
      ...hour,
      temperature: Math.round(baseTemp + (Math.random() - 0.5) * 20),
    })),
    daily: mockWeatherData.daily.map(day => ({
      ...day,
      high: Math.round(baseTemp + Math.random() * 15),
      low: Math.round(baseTemp - Math.random() * 15),
    })),
  };
}