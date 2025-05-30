export interface WeatherLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  location: WeatherLocation;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  sunrise: number;
  sunset: number;
  lastUpdated: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  precipitationChance: number;
}

export interface HourlyForecast {
  time: number;
  temperature: number;
  description: string;
  icon: string;
  precipitationChance: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}

export interface FavoriteLocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  temperature?: number;
  description?: string;
  icon?: string;
}

export interface GeolocationCoords {
  lat: number;
  lon: number;
}
