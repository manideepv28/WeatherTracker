import { useState, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherLocation } from "@/types/weather";
import { useLocationSearch } from "@/hooks/use-weather";
import { useGeolocation } from "@/hooks/use-geolocation";

interface WeatherSearchProps {
  onLocationSelect: (location: WeatherLocation) => void;
  onCurrentLocation: (coords: { lat: number; lon: number }) => void;
}

export default function WeatherSearch({ onLocationSelect, onCurrentLocation }: WeatherSearchProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WeatherLocation[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { mutate: searchLocations, isPending: isSearching } = useLocationSearch();
  const { getCurrentLocation, loading: geoLoading, error: geoError, coords } = useGeolocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 3) {
        searchLocations(query, {
          onSuccess: (results) => {
            setSearchResults(results);
            setShowResults(true);
          },
          onError: (error) => {
            console.error("Search error:", error);
            setSearchResults([]);
            setShowResults(false);
          },
        });
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchLocations]);

  const handleLocationSelect = (location: WeatherLocation) => {
    setQuery(location.name);
    setShowResults(false);
    onLocationSelect(location);
  };

  const handleCurrentLocation = () => {
    getCurrentLocation();
  };

  // Listen for geolocation success
  useEffect(() => {
    if (coords) {
      onCurrentLocation(coords);
    }
  }, [coords, onCurrentLocation]);

  return (
    <div className="flex items-center space-x-4 flex-1 max-w-lg">
      <div className="relative flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-4"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
            <CardContent className="p-0">
              {searchResults.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="font-medium">{location.name}</span>
                    <span className="text-gray-500 ml-2">{location.country}</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Button
        onClick={handleCurrentLocation}
        disabled={geoLoading}
        variant="default"
        size="default"
        className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
      >
        {geoLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <MapPin className="h-4 w-4 mr-2" />
        )}
        <span className="hidden sm:inline">Current Location</span>
      </Button>
    </div>
  );
}
