import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import CurrentWeatherCard from "@/components/weather/current-weather";
import ForecastCard from "@/components/weather/forecast-card";
import TemperatureChart from "@/components/weather/temperature-chart";
import FavoriteLocations from "@/components/weather/favorite-locations";
import WeatherSearch from "@/components/weather/weather-search";
import { useCurrentWeather, useWeatherByLocation } from "@/hooks/use-weather";
import { useGeolocation } from "@/hooks/use-geolocation";
import { WeatherLocation, GeolocationCoords } from "@/types/weather";

export default function Dashboard() {
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null);
  const [currentCoords, setCurrentCoords] = useState<GeolocationCoords | null>(null);

  const { 
    data: currentWeatherData, 
    isLoading: isCurrentLoading, 
    error: currentError 
  } = useCurrentWeather(currentCoords);

  const { 
    data: locationWeatherData, 
    isLoading: isLocationLoading, 
    error: locationError 
  } = useWeatherByLocation(selectedLocation);

  // Use location weather if available, otherwise current weather
  const weatherData = locationWeatherData || currentWeatherData;
  const isLoading = isLocationLoading || isCurrentLoading;
  const error = locationError || currentError;

  const handleLocationSelect = (location: WeatherLocation) => {
    setSelectedLocation(location);
    setCurrentCoords(null); // Clear current coords when selecting a specific location
  };

  const handleCurrentLocation = (coords: GeolocationCoords) => {
    setCurrentCoords(coords);
    setSelectedLocation(null); // Clear selected location when using current location
  };

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Weather Error",
        description: error.message || "Failed to fetch weather data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const { getCurrentLocation } = useGeolocation();

  // Try to get current location on initial load
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">WeatherScope</h1>
              </div>
              <WeatherSearch 
                onLocationSelect={handleLocationSelect}
                onCurrentLocation={handleCurrentLocation}
              />
            </div>
          </div>
        </header>

        {/* Loading State */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <Card>
              <CardContent className="p-6 flex items-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-700">Loading weather data...</span>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">WeatherScope</h1>
              </div>
              <WeatherSearch 
                onLocationSelect={handleLocationSelect}
                onCurrentLocation={handleCurrentLocation}
              />
            </div>
          </div>
        </header>

        {/* Error State */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-red-50 border border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Unable to fetch weather data</h3>
                  <p className="mt-2 text-sm text-red-700">
                    {error.message || "Please check your internet connection and try again."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">WeatherScope</h1>
            </div>
            <WeatherSearch 
              onLocationSelect={handleLocationSelect}
              onCurrentLocation={handleCurrentLocation}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {weatherData && (
          <>
            {/* Current Weather Card */}
            <div className="mb-8">
              <CurrentWeatherCard weather={weatherData.current} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="xl:col-span-2 space-y-8">
                {/* 7-Day Forecast */}
                <ForecastCard forecast={weatherData.daily} />

                {/* Temperature Trends Chart */}
                <TemperatureChart hourlyData={weatherData.hourly} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Favorite Locations */}
                <FavoriteLocations onLocationSelect={handleLocationSelect} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
