import React, { useState, useEffect } from 'react';
import { Search, Cloud, Sun, CloudRain, CloudDrizzle, CloudSnow, Wind, Droplet, Thermometer } from 'lucide-react';
import SearchSuggestions from './components/SearchSuggestions';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';

const API_KEY = '09f3dcc01230cb7cda80a2c4f0a259fa';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODING_API_URL = 'https://api.openweathermap.org/geo/1.0/direct';

// Weather icon component
const WeatherIcon = ({ weatherType, size = 'text-4xl' }) => {
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
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

  return <span className={size}>{getIcon(weatherType)}</span>;
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  // Load default city on initial render
  useEffect(() => {
    checkWeather('Delhi');
  }, []);

  const checkWeatherByCoords = async (lat, lon, cityName = '') => {
    if (lat === undefined || lon === undefined) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('Fetching weather by coordinates:', { lat, lon });

      const weatherUrl = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      const forecastUrl = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }

      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData);

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecastData(forecastData);
      }

      // Update search query with the actual city name from the weather data
      if (weatherData.name) {
        setSearchQuery(weatherData.name);
      } else if (cityName) {
        setSearchQuery(cityName);
      }
      
      setShowSuggestions(false);
    } catch (err) {
      console.error('Error fetching weather by coordinates:', err);
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const checkWeather = async (city) => {
    if (!city) return;

    setIsLoading(true);
    setError('');

    try {
      console.log('Fetching weather for:', city);

      // First try with the city name as is
      const weatherUrl = `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
      const forecastUrl = `${API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

      console.log('Weather URL:', weatherUrl);

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      console.log('Weather response status:', weatherResponse.status);

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json().catch(() => ({}));
        console.error('Weather API error:', errorData);
        throw new Error(errorData.message || 'City not found. Please try another location.');
      }

      const weatherData = await weatherResponse.json();
      console.log('Weather data:', weatherData);
      setWeatherData(weatherData);

      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        console.log('Forecast data:', forecastData);
        setForecastData(forecastData);
      }

      setSearchQuery(weatherData.name || city);
      setShowSuggestions(false);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const popularCities = [
    { name: 'London', country: 'GB' },
    { name: 'New York', country: 'US' },
    { name: 'Tokyo', country: 'JP' },
    { name: 'Paris', country: 'FR' },
    { name: 'Sydney', country: 'AU' },
    { name: 'Mumbai', country: 'IN' },
    { name: 'Dubai', country: 'AE' },
    { name: 'Singapore', country: 'SG' },
    { name: 'Toronto', country: 'CA' },
    { name: 'Berlin', country: 'DE' },
    { name: 'Moscow', country: 'RU' },
    { name: 'Cairo', country: 'EG' },
    { name: 'Cape Town', country: 'ZA' },
    { name: 'Rio de Janeiro', country: 'BR' },
    { name: 'Bangkok', country: 'TH' }
  ];

  // Get country flag emoji
  const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Search for cities using OpenWeather Geocoding API
  const searchCities = async (query) => {
    if (!query.trim()) {
      setSuggestions([...recentSearches]);
      setShowSuggestions(recentSearches.length > 0);
      return;
    }

    try {
      setIsSearching(true);
      
      // Call OpenWeather Geocoding API
      const response = await fetch(
        `${GEOCODING_API_URL}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch locations');
      
      const data = await response.json();
      
      // Format the API response to match our suggestion format
      const formattedSuggestions = data.map(city => ({
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon,
        displayName: `${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`
      }));
      
      // Add recent searches that match the query but aren't in the API results
      const recentMatches = recentSearches.filter(
        item => item.name.toLowerCase().includes(query.toLowerCase()) &&
        !formattedSuggestions.some(c => c.name === item.name && c.country === item.country)
      );
      
      setSuggestions([...formattedSuggestions, ...recentMatches]);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Fallback to recent searches on error
      setSuggestions([...recentSearches]);
      setShowSuggestions(recentSearches.length > 0);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Debounced search function
  const debouncedSearch = React.useCallback(
    debounce((value) => {
      searchCities(value);
    }, 300),
    [recentSearches]
  );

  const handleInputChange = (value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    console.log('Search submitted:', query);
    if (query) {
      // Check if the query matches any of the current suggestions
      const matchedSuggestion = suggestions.find(suggestion => 
        (suggestion.displayName || suggestion.name).toLowerCase() === query.toLowerCase()
      );
      
      if (matchedSuggestion) {
        handleSuggestionSelect(matchedSuggestion);
      } else {
        // If no exact match, use the first suggestion or fall back to direct search
        if (suggestions.length > 0) {
          handleSuggestionSelect(suggestions[0]);
        } else {
          // Fallback to direct search
          const searchItem = { name: query, displayName: query };
          setRecentSearches(prev => [
            searchItem,
            ...prev.filter(item => 
              item.name.toLowerCase() !== query.toLowerCase() && 
              item.displayName?.toLowerCase() !== query.toLowerCase()
            )
          ].slice(0, 5));
          
          checkWeather(query);
          setShowSuggestions(false);
        }
      }
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    const cityName = suggestion.displayName || suggestion.name || suggestion;
    
    setSearchQuery(cityName);
    
    // Add to recent searches if not already present
    const newRecent = {
      name: suggestion.name || cityName,
      country: suggestion.country,
      state: suggestion.state,
      displayName: suggestion.displayName || cityName,
      lat: suggestion.lat,
      lon: suggestion.lon
    };
    
    setRecentSearches(prev => [
      newRecent,
      ...prev.filter(
        item => 
          (item.name.toLowerCase() !== newRecent.name.toLowerCase()) ||
          (item.country !== newRecent.country)
      )
    ].slice(0, 5));
    
    // If we have coordinates, use them for more accurate results
    if (suggestion.lat && suggestion.lon) {
      checkWeatherByCoords(suggestion.lat, suggestion.lon, cityName);
    } else {
      checkWeather(cityName);
    }
    
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-start justify-center p-1 md:p-2 overflow-hidden">
      <div className="w-full h-full max-w-5xl max-h-[95vh] my-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-3 text-white shadow-2xl border border-white/20 relative h-full flex flex-col">
          {/* Gradient background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-3 z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-white/20 border border-white/30 rounded-xl py-4 px-5 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 text-base md:text-lg"
                  placeholder="Search for a city..."
                />
                {showSuggestions && (
                  <div className="absolute left-0 right-0 mt-1 bg-white/90 backdrop-blur-md rounded-xl shadow-lg overflow-hidden z-50 border border-white/20">
                    {isSearching ? (
                      <div className="p-3 text-center text-gray-600">
                        <div className="animate-pulse">Searching...</div>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <>
                        {suggestions.slice(0, 8).map((suggestion, index) => (
                          <div
                            key={`${suggestion.name}-${index}`}
                            className="p-3 hover:bg-gray-100/50 cursor-pointer flex items-center"
                            onClick={() => handleSuggestionSelect(suggestion)}
                          >
                            <span className="text-lg mr-2">
                              {suggestion.country ? getFlagEmoji(suggestion.country) : '📍'}
                            </span>
                            <span className="text-gray-800">
                              {suggestion.displayName || suggestion.name}
                            </span>
                          </div>
                        ))}
                      </>
                    ) : searchQuery.trim().length > 0 ? (
                      <div className="p-3 text-gray-600">
                        No results found for "{searchQuery}"
                      </div>
                    ) : recentSearches.length > 0 ? (
                      <>
                        <div className="px-3 pt-3 pb-1 text-xs font-medium text-gray-500">
                          Recent Searches
                        </div>
                        {recentSearches.map((item, index) => (
                          <div
                            key={`recent-${index}`}
                            className="p-3 hover:bg-gray-100/50 cursor-pointer flex items-center"
                            onClick={() => handleSuggestionSelect(item)}
                          >
                            <span className="text-gray-400 mr-2">🕒</span>
                            <span className="text-gray-700">{item.name}</span>
                          </div>
                        ))}
                      </>
                    ) : null}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl p-4 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-200">{error}</p>
            </div>
          ) : weatherData ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col lg:flex-row gap-3 mb-3">
                {/* Left Column - Current Weather */}
                <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="text-center mb-4">
                    <h1 className="text-3xl font-light mb-1">{weatherData.name}, {weatherData.sys.country}</h1>
                    <p className="text-lg opacity-80">
                      {weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)}
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-6 mb-6">
                      <div className="text-7xl font-light">
                        {Math.round(weatherData.main.temp)}°
                      </div>
                      <div className="bg-white/20 rounded-full p-4">
                        <WeatherIcon weatherType={weatherData.weather[0].main} size="text-6xl" />
                      </div>
                    </div>

                    {/* Weather Details */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                        <Droplet className="mx-auto mb-1 text-blue-200 w-5 h-5" />
                        <div className="text-base font-medium">{weatherData.main.humidity}%</div>
                        <div className="text-xs opacity-70">Humidity</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                        <Wind className="mx-auto mb-1 text-blue-200 w-5 h-5" />
                        <div className="text-base font-medium">{Math.round(weatherData.wind.speed * 3.6)} km/h</div>
                        <div className="text-xs opacity-70">Wind</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                        <Thermometer className="mx-auto mb-1 text-blue-200 w-5 h-5" />
                        <div className="text-base font-medium">{Math.round(weatherData.main.feels_like)}°</div>
                        <div className="text-xs opacity-70">Feels like</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Daily Forecast */}
                <div className="flex-1 flex flex-col bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  {forecastData && (
                    <DailyForecast
                      dailyData={forecastData.list.filter((_, index) => index % 8 === 0)}
                    />
                  )}
                </div>
              </div>

              {/* Full Width Hourly Forecast */}
              <div className="w-full">
                {forecastData && <HourlyForecast hourlyData={forecastData.list} />}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Cloud className="w-16 h-16 text-white/60 mb-4" />
              <p className="text-white/80 text-lg">Search for a city to see weather data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;