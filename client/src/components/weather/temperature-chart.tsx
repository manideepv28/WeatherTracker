import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { HourlyForecast } from "@/types/weather";
import { useState } from "react";

interface TemperatureChartProps {
  hourlyData: HourlyForecast[];
}

export default function TemperatureChart({ hourlyData }: TemperatureChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("24h");

  const formatChartData = () => {
    return hourlyData.map((hour) => ({
      time: new Date(hour.time * 1000).toLocaleTimeString([], { 
        hour: '2-digit',
        minute: '2-digit'
      }),
      temperature: hour.temperature,
    }));
  };

  const chartData = formatChartData();

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Temperature Trends</h3>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "24h" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("24h")}
              className="text-xs"
            >
              24H
            </Button>
            <Button
              variant={selectedPeriod === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("7d")}
              className="text-xs"
            >
              7D
            </Button>
            <Button
              variant={selectedPeriod === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("30d")}
              className="text-xs"
            >
              30D
            </Button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
