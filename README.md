# Weather App

A beautiful, responsive weather application built with React and powered by the OpenWeather API. Get current weather conditions, hourly forecasts, and 7-day forecasts for any location worldwide.


## Features

- 🌍 Search for weather by city name with real-time suggestions
- 🌤️ View current weather conditions with beautiful weather icons
- 📅 7-day weather forecast
- ⏱️ 24-hour hourly forecast
- 📱 Fully responsive design that works on all devices
- 🌙 Dark/light mode (system preference aware)
- 🚀 Fast and lightweight
- 📍 Recent search history

## Technologies Used

- ⚛️ React 18
- 🎨 Tailwind CSS for styling
- 🌐 OpenWeather API for weather data
- 🔍 OpenWeather Geocoding API for location search
- ⚡ Vite for fast development and building
- 📦 npm for package management

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v7 or later) or yarn
- OpenWeather API key (free tier available)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your OpenWeather API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Available Scripts

- `npm run dev` or `yarn dev` - Start the development server
- `npm run build` or `yarn build` - Build the app for production
- `npm run preview` or `yarn preview` - Preview the production build locally

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── DailyForecast.jsx # 7-day forecast component
│   └── HourlyForecast.jsx# 24-hour forecast component
├── App.jsx              # Main application component
└── main.jsx             # Application entry point
```

## API Usage

This application uses the OpenWeather API. You'll need to sign up for a free API key at [OpenWeather](https://openweathermap.org/api).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Weather data provided by [OpenWeather](https://openweathermap.org/)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/) and [React](https://reactjs.org/)
