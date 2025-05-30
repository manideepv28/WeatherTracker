import { Heart, Wind, Eye, Droplets, Gauge, Sun, Moon, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CurrentWeather } from "@/types/weather";
import { useFavorites } from "@/hooks/use-favorites";

interface CurrentWeatherProps {
  weather: CurrentWeather;
}

export default function CurrentWeatherCard({ weather }: CurrentWeatherProps) {
  const { isFavoriteLocation, addToFavorites, removeFromFavorites } = useFavorites();
  const isFav = isFavoriteLocation(weather.location.id);

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(weather.location.id);
    } else {
      addToFavorites({
        id: weather.location.id,
        name: weather.location.name,
        country: weather.location.country,
        lat: weather.location.lat,
        lon: weather.location.lon,
        temperature: weather.temperature,
        description: weather.description,
        icon: weather.icon,
      });
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getLastUpdated = () => {
    const minutes = Math.floor((Date.now() - weather.lastUpdated) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    return `${minutes} minutes ago`;
  };

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {weather.location.name}, {weather.location.country}
            </h2>
            <p className="text-sm text-slate-500">
              Updated {getLastUpdated()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFavorite}
            className={`${isFav ? 'text-orange-500 hover:text-orange-600' : 'text-slate-400 hover:text-orange-500'} transition-colors`}
          >
            <Heart className={`h-6 w-6 ${isFav ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Weather Display */}
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-6">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="w-20 h-20"
              />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-5xl font-light text-slate-900">
                  {weather.temperature}
                </span>
                <span className="text-2xl font-light text-slate-500 ml-1">°F</span>
              </div>
              <p className="text-lg text-slate-600 mt-1 capitalize">
                {weather.description}
              </p>
              <p className="text-sm text-slate-500">
                Feels like {weather.feelsLike}°F
              </p>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center text-slate-600 mb-1">
                <Droplets className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Humidity</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{weather.humidity}%</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center text-slate-600 mb-1">
                <Wind className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Wind</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{weather.windSpeed} mph</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center text-slate-600 mb-1">
                <Gauge className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Pressure</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">
                {(weather.pressure * 0.02953).toFixed(2)} in
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center text-slate-600 mb-1">
                <Eye className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Visibility</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{weather.visibility} mi</p>
            </div>
          </div>
        </div>

        {/* Today's Highlights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-900">Sunrise</p>
                <p className="text-lg font-semibold text-yellow-900">
                  {formatTime(weather.sunrise)}
                </p>
              </div>
              <Sun className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-900">Sunset</p>
                <p className="text-lg font-semibold text-orange-900">
                  {formatTime(weather.sunset)}
                </p>
              </div>
              <Moon className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-900">Visibility</p>
                <p className="text-lg font-semibold text-green-900">{weather.visibility} miles</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
