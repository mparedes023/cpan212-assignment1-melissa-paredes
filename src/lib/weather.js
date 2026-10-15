import { config } from '../config.js';
import { geocodeCity, getForecast } from './open-meteo.js';
import { describeWeatherCode } from './weather-codes.js';
import { createCache } from './cache.js';

// TODO (you): create one cache for the whole app, with a time to live of
// config.cacheTtlSeconds.
const weatherCache=createCache(config.cacheTtlSeconds);
// TODO (you): return the weather summary for one city, in the shape shown on
// the assignment page. Check the cache first. On a miss, geocode the city, get
// the forecast, build the summary, store it, and return it with cached: false.
// On a hit, return the stored summary with cached: true.
export async function getCityWeather(city) {
  const cachedWeatherSummary=weatherCache.get(city);

  if (cachedWeatherSummary!==undefined){
    return {
      ...cachedWeatherSummary,
      cached:true
    }
  }

  const location=await geocodeCity(city);

  const forecast = await getForecast(
    location.latitude,
    location.longitude
  );

  const current = forecast.current;

  const summary = {
    city: location,
    current: {
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      weatherCode: current.weather_code,
      description: describeWeatherCode(current.weather_code)
    },

    daily: forecast.daily
  };

  weatherCache.set(city, summary);

  return {
    ...summary,
    cached: false
  };
}



// TODO (you): return the cache statistics for GET /api/cache/stats.
export function getCacheStats() {
  return weatherCache.stats();
}
