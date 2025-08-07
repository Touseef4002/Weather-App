import React from 'react';
import { Cloud, Sun, CloudRain, CloudDrizzle, CloudSnow, Droplet, Wind } from 'lucide-react';

const HourlyForecast = ({ hourlyData }) => {
  const getWeatherIcon = (weatherType) => {
    switch (weatherType?.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'drizzle':
        return '🌦️';
      case 'snow':
        return '❄️';
      case 'thunderstorm':
        return '⛈️';
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
        return '🌫️';
      default:
        return '☁️';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true })
      .replace(' ', '')
    // .replace('AM', 'a')
    // .replace('PM', 'p');
  };

  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2">Hourly Forecast</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {hourlyData.slice(0, 12).map((hour, index) => (
          <div
            key={index}
            className="flex-shrink-0 bg-white/5 rounded-lg p-2 text-center w-20"
          >
            <div className="text-xs opacity-80">{formatTime(hour.dt)}</div>
            <div className="text-xl">{getWeatherIcon(hour.weather[0].main)}</div>
            <div className="text-sm font-medium">{Math.round(hour.main.temp)}°</div>
            <div className="text-xs opacity-70">{hour.main.humidity}%</div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default HourlyForecast;