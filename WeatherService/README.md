## Weatherservice

### Setup
1. For the weather forecast, the https://openweathermap.org/guide API is used.
Create an account and create an API KEY for the 5 Day / 3 Hour Forecast. (There is a free contract which is sufficient)
2. Create a .env file, paste the content of the .sample-env file in there and set the following environment variable
   1. `KEY` : a key for security
   2. `API_KEY` : api key of step 1
   3. `LOCATION_LAT` : Lateral coordinates of your location
   4. `LOCATION_LON` : Longitual coordinates of your location
3. Execute `docker-compose build` to build the weatherservice
4. Execute `docker-compose up -d` to run the weatherservice in detached mode
5. The tasksmanager should run now on port 9000. If you want to change the port, you need to modify the docker-compose.yml respectively.