import { Card, CardContent } from "@/components/ui/card";
import { DailyForecast } from "@/types/weather";

interface ForecastCardProps {
  forecast: DailyForecast[];
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">7-Day Forecast</h3>
        
        <div className="space-y-3">
          {forecast.map((day, index) => (
            <div
              key={day.date}
              className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-center flex-1">
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <img
                    src={getWeatherIcon(day.icon)}
                    alt={day.description}
                    className="w-8 h-8"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {index === 0 ? "Today" : day.dayName}
                  </p>
                  <p className="text-sm text-slate-500 capitalize">{day.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-slate-500 mr-2">
                  {day.precipitationChance}%
                </span>
                <div className="text-right">
                  <span className="font-semibold text-slate-900">{day.high}°</span>
                  <span className="text-slate-500 ml-2">{day.low}°</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
