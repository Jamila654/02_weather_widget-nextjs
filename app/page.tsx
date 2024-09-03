"use client";

import { useState } from "react";
import axios from "axios";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface ForecastData {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
  }[];
}

export default function Home() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string>("");

  const API_KEY = "83923403d64ce37ceb307867878b2d55";

  const fetchWeather = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!city) {
      setError("Please enter a city name");
      return;
    }

    try {
      const currentWeatherResponse = await axios.get<WeatherData>(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      const forecastResponse = await axios.get<ForecastData>(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      setCurrentWeather(currentWeatherResponse.data);
      setForecast(forecastResponse.data);
      setError("");
    } catch (error) {
      setError("City not found");
      setCurrentWeather(null);
      setForecast(null);
    }
  };

  const renderForecast = () => {
    if (!forecast) return null;

    const dailyForecasts = forecast.list.filter((reading) =>
      reading.dt_txt.includes("12:00:00")
    );

    return dailyForecasts.map((day, index: number) => {
      const date = new Date(day.dt_txt);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      return (
        <div key={index} className="text-center p-4 border rounded-lg">
          <p className="font-bold">{dayName}</p>
          <img
            src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            className="mx-auto"
          />
          <p>{day.weather[0].description}</p>
          <p>{day.main.temp}°C</p>
        </div>
      );
    });
  };

  return (
    <main
      style={{
        backgroundImage: `url('/background.avif')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="app w-[90%] sm:w-[60%] lg:w-[40%] bg-white border-4 rounded-lg border-gray-700 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Weather App</h1>
        <form onSubmit={fetchWeather} className="mb-4">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
          >
            Get Weather
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        {currentWeather && (
          <div className="current-weather flex items-center justify-around mb-6">
            <img
              src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
              alt="Weather Icon"
              className=" w-20 h-20  sm:w-32 sm:h-32"
            />
            <div className="text-center">
              <h2 className="text-md sm:text-4xl font-bold">{currentWeather.main.temp}°C</h2>
            </div>
            <div className="flex flex-col items-center">
              <p>Wind: {currentWeather.wind.speed} m/s</p>
              <p>Pressure: {currentWeather.main.pressure} hPa</p>
              <p>{currentWeather.weather[0].description}</p>
            </div>
          </div>
        )}

        {forecast && (
          <div className="forecast grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {renderForecast()}
          </div>
        )}
      </div>
    </main>
  );
}








