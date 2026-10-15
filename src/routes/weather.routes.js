import { Router } from 'express';
import { parseCity, parseCities } from '../lib/validation.js';
import { getCityWeather } from '../lib/weather.js';
export const weatherRouter = Router();


// TODO (you): GET /api/weather?city=Toronto
// Validate with parseCity,
//  get the summary with getCityWeather, and 
// respond
// with { data, attribution }. Routes never call fetch themselves.
weatherRouter.get('/weather', async(req, res,next) => {

    try {

    const city = parseCity(req.query.city);

    const weatherSummary = await getCityWeather(city);

    res.json({
      data: weatherSummary,
      attribution: 'Weather data by Open-Meteo.com (https://open-meteo.com/)'
    });
  } catch (error) {

    next(error);
  }
});

// TODO (you): GET /api/compare?cities=Toronto,Vancouver,Halifax
// Validate with parseCities, 
// start every lookup at once with Promise.allSettled,
// then build the cities array and the summary described on the assignment page.
weatherRouter.get('/compare', async(req, res,next) => {
    try {
    const cities = parseCities(req.query.cities);

    const results = await Promise.allSettled(
      cities.map((city) => getCityWeather(city))
    );



    const cityResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return {
          city: cities[index],
          ok:true,
          weather: result.value
        };
      }

      return {
        city: cities[index],
        ok:false,
        error: {
          status: result.reason.status ?? 500,
          message: result.reason.message
        }
      };
    });
    const successfulCities = cityResults.filter(
      (city) => city.ok
    );
    let warmest = null;
    let coldest = null;

    for (const city of successfulCities) {
      const temperature = city.weather.current.temperatureC;



      if (
        warmest === null ||
        temperature > warmest.weather.current.temperatureC
      ) {
        warmest = city;
      }

      if (
        coldest === null ||
        temperature < coldest.weather.current.temperatureC
      ) {
        coldest = city;
      }
    }


    res.json({
      data: {
        cities: cityResults,
        summary: {
          succeeded: successfulCities.length,
          failed: cityResults.length - successfulCities.length,
          warmest: warmest
            ? {
                city: warmest.weather.location.name,
                temperatureC: warmest.weather.current.temperatureC
              }
            : null,
            coldest: coldest
              ? {
                  city: coldest.weather.location.name,
                  temperatureC: coldest.weather.current.temperatureC
                }
              : null
        }
      },
        attribution: 'Weather data by Open-Meteo.com (https://open-meteo.com/)'
    });

  } catch (error) {

    next(error);
  }
});
