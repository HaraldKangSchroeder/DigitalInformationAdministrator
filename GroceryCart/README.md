## Grocery Cart

### Setup backend

1. Create a .env file, paste the content of the .sample-env file in there and set the following environment variable
   1. `KEY` : a key for security
   2. `PGUSER` : username of the psql dbms
   3. `PGPASSWORD` : password for the `PGUSER`
2. Execute `docker-compose build` to build the grocerycart
3. Execute `docker-compose up -d` to run the grocerycart in detached mode
4. The grocery cart should run now on port 9001. If you want to change the port, you need to modify the docker-compose.yml respectively.

### Setup frontend

1. Use the GroceryCart.apk file which you can find in ./mobile-app to install the app on your mobile phone (android)
2. Go to the options view where you can set
    * remote host : uri of the remote host. Here, it would be `http://<HOSTNAME>:9001`
    * socket path : This should be `/dia/socket.io` per default
    * username : only necessary if you are using a reverse proxy with basic auth
    * password : only necessary if you are using a reverse proxy with basic auth


### Heroku
I myself host this component on Heroku, since it is necessary to access the data from outside your local network