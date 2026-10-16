# City Weather API
This service retrieves current weather conditions and three day weather forecast for a city and allows users to compare weather conditions in 2 to 5 cities. 

## Run it
Tools Needed
- Node.js
- npm 

Step 1: clone the repo
Step 2: install the dependencies 
Step 3: copy .env.example to .env.
Step 4: start the development serve

You can run these commands in your terminal:
git clone https://github.com/mparedes023/cpan212-assignment1-melissa-paredes.git
cd cpan212-assignment1-melissa-paredes
npm install
cp .env.example .env
npm run dev

Must have Node.js 24 installed so that the application can run.

## Environment variables
| Variable | Default | What It Controls|
|---|---|---|
| `PORT` | `4000` | This sets the port the server runs on. |
| `GEOCODING_URL` | `https://geocoding-api.open-meteo.com/v1` | This finds a city's location. |
| `FORECAST_URL` | `https://api.open-meteo.com/v1` | Gets the weather forecast. |
| `UPSTREAM_TIMEOUT_MS` | `5000` | Sets how long to wait for a response before timing out. |
| `CACHE_TTL_SECONDS` | `600` | Sets how long weather data stays in the cache (10 minutes). |

## Endpoints
1. Get weather for a city
Example request: GET /api/weather?city=Ottawa
Example using curl: curl -i "http://localhost:4000/api/weather?city=Ottawa"

This endpoint returns the city's location, weather, current time when the data was fetched,provides the weather conditions for three days after the current date, and if the result is the result of a previous cache.

2. Compare weather between cities
Example request: GET /api/compare?cities=Toronto,Vancouver,Halifax
Example using curl: curl -i "http://localhost:4000/api/compare?cities=Toronto,Vancouver,Halifax"

Compares the weather conditions of 2 to 5 cities. It returns the results for each city, the number of successful and failed lookups, and identifies the warmest and coldest cities based on their current temperatures.

3. Cache Statistics
Example request: GET /api/cache/stats
Example using curl: curl -i "http://localhost:4000/api/cache/stats"

## Testing
```bash
# Weather for a Toronto: 200
curl -i "http://localhost:4000/api/weather?city=Toronto"
```
```bash
# Request the same city again: 200
curl -i "http://localhost:4000/api/weather?city=Toronto"
```
```bash
# Request with no city: 400
curl -i "http://localhost:4000/api/weather"
```
```bash
# Request to compare three cities Toronto Halifax and Vancouver:200
curl -i "http://localhost:4000/api/compare?cities=Toronto,Vancouver,Halifax"
```
```bash
# Weather for a city that doesn't exist: 404
curl -i "http://localhost:4000/api/weather?city=djfakdjfafMelissaRed"
```
```bash
# Compare with one city that doesn't exist: 200
curl -i "http://localhost:4000/api/compare?cities=Toronto,MelissaRed"
```
```bash
# Compare too many cities (more than 5): 400
curl -i "http://localhost:4000/api/compare?cities=Vancouver,Halifax,Ottawa,Toronto,Montreal,Calgary"
```
```bash
# compare with a repeated city:400
curl -i "http://localhost:4000/api/compare?cities=Toronto,toronto"
```
```bash
# Cache stats: 200
curl -i "http://localhost:4000/api/cache/stats"
```
```bash
# Unknown Route: 404
curl -i "http://localhost:4000/api/unknown"
```

## Data source
Credit to Open-Meteo for the weather and geocoding data.
The link can be found here: https://open-meteo.com/.

## AI use
Google Gemini was used to simplify class notes so that I could apply the concepts to this assignment. I also used it to understand some error messages in my terminal during testing.
