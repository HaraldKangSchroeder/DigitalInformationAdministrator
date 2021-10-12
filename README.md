# DIA - Digital Information Administrator

DIA is a private project of mine to improve the management of home relevant tasks. 

VIDEO


## Setup

1. The application comes along with Docker, specifically with docker-compose.\
You need to install those first -
see https://docs.docker.com/compose/install/

2. For the weather forecast, the https://openweathermap.org/guide API is used.
Create an account and create an API KEY for the 5 Day / 3 Hour Forecast. (There is a free contract which is sufficient)

3. Create a .env file, paste the content of the .sample-env file in there and set the following environment variables
    * `WEATHER_API_KEY` :\
    API KEY from Step 2.
    * `WEATHER_LOCATION_LAT` :\
    Lateral coordinates of your location
    * `WEATHER_LOCATION_LON` :\
    Longitual coordinates of your location
    * `REACT_APP_BASEPATH_APP` :\
    Path for the app of DIA, so you can access it under\
    \<`HOSTNAME`\>:8910\<`REACT_APP_BASEPATH_APP`> 
    (e.g. /dia/app)
    * `REACT_APP_BASEPATH_MANAGEMENT` :\
    Path for the management of DIA, so you can access it under\
    \<`HOSTNAME`\>:8910\<`REACT_APP_BASEPATH_MANAGEMENT`>
    (e.g. /dia/app)
    * `REACT_APP_BASEPATH_MANAGEMENT` :\
    Path for the websocket communication (e.g. /dia/socket.io)\
    This path is also relevant for the mobile app since the communication runs through it

4. Execute `docker-compose up` to start the application (append `-d` flag to start in detached mode). This might take a couple minutes.

## Personal Setup
My application is constantly running (in detached mode) on a raspberry pi 4 which is attached to a touchdisplay (https://www.sunfounder.com/products/10inch-touchscreen-for-raspberrypi). To attach both components on a surface (in my case the fridge door), i created a case using a 3d printer.

Since the mobile app needs to access the data of the shopping list from outside the local network, i also applied portforwarding.
This indicates security leaks, which is why I've also set up an nginx server that acts as a reverse proxy with further security measures.