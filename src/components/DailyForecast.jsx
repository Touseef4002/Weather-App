import React from 'react';

const DailyForecast = ({ dailyData }) => {
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

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Now';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tmr';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3);
    }
  };

  if (!dailyData || dailyData.length === 0) return null;

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-medium mb-2">5-Day Forecast</h3>
      <div className="flex-1 overflow-y-auto pr-1 -mr-1">
        <div className="space-y-1">
          {dailyData.slice(0, 7).map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <div className="text-sm font-medium w-16">{formatDay(day.dt)}</div>
              <div className="text-2xl w-10 text-center">
                {getWeatherIcon(day.weather[0]?.main)}
              </div>
              <div className="flex items-center gap-3 w-20 justify-end">
                <span className="text-sm">{Math.round(day.main.temp_max)}°</span>
                <span className="text-sm opacity-70">{Math.round(day.main.temp_min)}°</span>
              </div>
              <div className="text-sm opacity-70 w-12 text-right">
                {Math.round(day.pop * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyForecast;