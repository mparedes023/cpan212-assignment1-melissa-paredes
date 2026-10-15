import { config } from '../config.js';
import { HttpError } from './http-error.js';

// This is the only file that calls fetch or knows Open-Meteo's URLs.
// The exact requests are on the assignment page.
// purpose of open-mateo:
// 1. takes city name and returns where it is 
//2. uses coordinates from 1 to return the current weather and forecast for 3 days
// TODO (you): write a helper that fetches a URL and returns the parsed JSON.
//   - Pass signal: AbortSignal.timeout(config.upstreamTimeoutMs) to fetch.
//   - fetch resolves for every HTTP status, so check res.ok yourself.
//   - Turn every failure into an HttpError: 504 when the timeout fired
//     (err.name is 'TimeoutError'), 502 for a network failure, a status that
//     isn't ok, or a body that isn't JSON.

// https constructor(status,message, details)
async function fetchJson(url, serviceName) {
  let response;

  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(config.upstreamTimeoutMs)
    });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new HttpError(504,`The ${serviceName} service did not respond within ${config.upstreamTimeoutMs}ms`
      );
    }

    throw new HttpError(502,`Cannot get a valid response from the ${serviceName} service`);
  }

  if (!response.ok) {
    throw new HttpError(502,`Cannot get response from the ${serviceName} service`);
  }

  try {
    return await response.json();
  } catch {
    throw new HttpError(502,`Cannot get a valid response from the ${serviceName} service`);
  }
}

// TODO (you): look up a city with the geocoding API and return
// { name, region, country, latitude, longitude, timezone } for the first result.
// Throw a 404 HttpError when there are no results.
export async function geocodeCity(name) {
  const url=new URL(`${config.geocodingUrl}/search`);
  url.search=new URLSearchParams({
    name,
    count:'1',
    language:'en',
    format:'json'
  }).toString();
  const data=await fetchJson(url,'geocoding');
  if (!data.results||data.results.length===0){
      throw new HttpError(404,`no results for ${name}`);
  }

  const cityInformation= data.results[0];
  return{
    name:cityInformation.name,
    region:cityInformation.admin1 ?? null,
    country: cityInformation.country ?? null,
    latitude: cityInformation.latitude,
    longitude: cityInformation.longitude,
    timezone: cityInformation.timezone
  };

}

// TODO (you): get the current weather and a 3-day daily forecast from the
// forecast API and return the parsed response.
export async function getForecast(latitude, longitude) {
    const url = new URL(`${config.forecastUrl}/forecast`);

    url.search = new URLSearchParams({

      latitude: String(latitude),
      longitude: String(longitude),
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'auto',
      forecast_days: '3'
    }).toString();

    const forecastData = await fetchJson(url, 'forecast');

    return forecastData;

}
