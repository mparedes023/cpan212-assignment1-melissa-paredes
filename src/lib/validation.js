
import { HttpError } from './http-error.js';

export function parseCity(value) {
  if (
    typeof value !== 'string' ||
    value.trim().length < 2 ||
    value.trim().length > 60
  ) {
    throw new HttpError(400, 'Invalid query', {
      city: 'city must be at least 2 to 60 characters'
    });
  }

  return value.trim();
}
// comparison must be 2 to 5 cities
export function parseCities(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new HttpError(400, 'Invalid query', {
      cities: 'cities must contain 2 to 5 city names'
    });
  }

  const cities = value.split(',').map((city) => city.trim());

  if (
    cities.length < 2 ||
    cities.length > 5 ||
    cities.some((city) => city.length < 2 || city.length > 60)
  ) {
    throw new HttpError(400, 'Invalid query', {
      cities: 'provide 2 to 5 city names, 2 to 60 characters each'
    });
  }

  const normalizedCities = cities.map((city) => city.toLowerCase());

  if (new Set(normalizedCities).size !== cities.length) {
    throw new HttpError(400, 'Invalid query', {
      cities: 'a city cannot be listed more than once in the query'
    });
  }

  return cities;
}
