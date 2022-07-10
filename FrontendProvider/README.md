## Frontendprovider

### Setup

1. Create a .env file, paste the content of the .sample-env file in there and set the following environment variable
   1. If you have set up the tasksmanager:
      1. `TASKS_MANAGER_URL` : the url to the tasksmanager
      2. `TASKS_MANAGER_KEY` : key for the tasksmanager
   2. If you have set up the grocery cart:
      1. `GROCERY_CART_URL` : the url to the grocery cart
      2. `GROCERY_CART_KEY` : key for the grocery cart
   3. If you have set up the weather service:
      1. `WEATHER_SERVICE_URL` : the url to the weather service
      2. `WEATHER_SERVICE_KEY` : key for the weather service
2. Execute `docker-compose build` to build the frontend provider
3. Execute `docker-compose up -d` to run the frontend provider in detached mode
4. The frontend provider should run now on port 8910. If you want to change the port, you need to modify docker-compose.yml respectively.
   1. You can access the app using `http://<HOSTNAME>:8910/app`
   2. You can access the management using `http://<HOSTNAME>:8910/management`