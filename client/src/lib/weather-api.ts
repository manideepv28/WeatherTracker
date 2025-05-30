import { WeatherData, WeatherLocation } from "@/types/weather";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "demo_key";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export class WeatherAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "WeatherAPIError";
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    if (response.status === 401) {
      throw new WeatherAPIError("Invalid API key. Please check your OpenWeatherMap API key.");
    }
    if (response.status === 404) {
      throw new WeatherAPIError("Location not found. Please check the location name.");
    }
    if (response.status >= 500) {
      throw new WeatherAPIError("Weather service temporarily unavailable. Please try again later.");
    }
    throw new WeatherAPIError(`Weather API error: ${response.statusText}`, response.status);
  }
  return response.json();
}

export async function searchLocations(query: string): Promise<WeatherLocation[]> {
  const response = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  
  const data = await handleResponse(response);
  
  return data.map((item: any) => ({
    id: `${item.lat}-${item.lon}`,
    name: item.name,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  }));
}

export async function getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
  const [currentResponse, forecastResponse] = await Promise.all([
    fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`),
    fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`)
  ]);

  const [currentData, forecastData] = await Promise.all([
    handleResponse(currentResponse),
    handleResponse(forecastResponse)
  ]);

  // Process current weather
  const current = {
    location: {
      id: `${lat}-${lon}`,
      name: currentData.name,
      country: currentData.sys.country,
      lat: currentData.coord.lat,
      lon: currentData.coord.lon,
    },
    temperature: Math.round(currentData.main.temp),
    feelsLike: Math.round(currentData.main.feels_like),
    description: currentData.weather[0].description,
    icon: currentData.weather[0].icon,
    humidity: currentData.main.humidity,
    windSpeed: Math.round(currentData.wind.speed),
    windDirection: currentData.wind.deg || 0,
    pressure: currentData.main.pressure,
    visibility: Math.round((currentData.visibility || 10000) / 1609.34), // Convert m to miles
    uvIndex: 0, // Not available in current weather
    sunrise: currentData.sys.sunrise,
    sunset: currentData.sys.sunset,
    lastUpdated: Date.now(),
  };

  // Process daily forecast (group by day)
  const dailyMap = new Map();
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        dayName: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
        high: item.main.temp_max,
        low: item.main.temp_min,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitationChance: Math.round((item.pop || 0) * 100),
        temps: [item.main.temp],
      });
    } else {
      const day = dailyMap.get(date);
      day.high = Math.max(day.high, item.main.temp_max);
      day.low = Math.min(day.low, item.main.temp_min);
      day.temps.push(item.main.temp);
    }
  });

  const daily = Array.from(dailyMap.values()).slice(0, 7).map((day: any) => ({
    date: day.date,
    dayName: day.dayName,
    high: Math.round(day.high),
    low: Math.round(day.low),
    description: day.description,
    icon: day.icon,
    precipitationChance: day.precipitationChance,
  }));

  // Process hourly forecast (next 24 hours)
  const hourly = forecastData.list.slice(0, 8).map((item: any) => ({
    time: item.dt,
    temperature: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    precipitationChance: Math.round((item.pop || 0) * 100),
  }));

  return { current, daily, hourly };
}

export async function getWeatherByLocation(location: WeatherLocation): Promise<WeatherData> {
  return getCurrentWeather(location.lat, location.lon);
}
