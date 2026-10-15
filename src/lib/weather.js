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
  const cacheKey = city.trim().toLowerCase();
  const cachedWeatherSummary=weatherCache.get(cacheKey);

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
  const daily = forecast.daily;

  const summary = {
    location: {
      name: location.name,
      region: location.region ?? null,
      country: location.country ?? null,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone
    },
    current: {
      time: current.time,
      temperatureC: current.temperature_2m,
      feelsLikeC: current.apparent_temperature,
      humidityPercent: current.relative_humidity_2m,
      windKmh: current.wind_speed_10m,
      weatherCode: current.weather_code,
      conditions: describeWeatherCode(current.weather_code)

      
    },

    daily: daily.time.slice(0, 3).map((date, index) => ({
      date,
      minC: daily.temperature_2m_min[index],
      maxC: daily.temperature_2m_max[index],
      precipitationChancePercent:
        daily.precipitation_probability_max[index] ?? null,
      weatherCode: daily.weather_code[index],
      conditions: describeWeatherCode(daily.weather_code[index])
    })),
    fetchedAt: new Date().toISOString(),
    
  };

  weatherCache.set(cacheKey, summary);

  return {
    ...summary,
    
    cached: false
  };
}



// TODO (you): return the cache statistics for GET /api/cache/stats.
export function getCacheStats() {
  return weatherCache.stats();
}
