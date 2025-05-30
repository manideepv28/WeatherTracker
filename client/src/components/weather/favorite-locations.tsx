import { Plus, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { WeatherLocation } from "@/types/weather";

interface FavoriteLocationsProps {
  onLocationSelect: (location: WeatherLocation) => void;
}

export default function FavoriteLocations({ onLocationSelect }: FavoriteLocationsProps) {
  const { favorites, removeFromFavorites } = useFavorites();

  const handleLocationClick = (favorite: any) => {
    onLocationSelect({
      id: favorite.id,
      name: favorite.name,
      country: favorite.country,
      lat: favorite.lat,
      lon: favorite.lon,
    });
  };

  const handleRemoveFavorite = (e: React.MouseEvent, locationId: string) => {
    e.stopPropagation();
    removeFromFavorites(locationId);
  };

  const getWeatherIcon = (iconCode?: string) => {
    if (!iconCode) return null;
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Favorite Locations</h3>
        </div>

        {favorites.length === 0 ? (
          <div className="mt-4 p-6 border-2 border-dashed border-slate-200 rounded-lg text-center">
            <p className="text-sm text-slate-500">Add locations to track weather</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((favorite) => (
              <div
                key={favorite.id}
                onClick={() => handleLocationClick(favorite)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center mr-3">
                    {favorite.icon ? (
                      <img
                        src={getWeatherIcon(favorite.icon)}
                        alt="Weather"
                        className="w-8 h-8"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {favorite.name}, {favorite.country}
                    </p>
                    <p className="text-sm text-slate-500 capitalize">
                      {favorite.description || "Weather data"}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center">
                  {favorite.temperature && (
                    <p className="font-semibold text-slate-900 mr-3">
                      {favorite.temperature}°F
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleRemoveFavorite(e, favorite.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
