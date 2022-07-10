## Tasksmanager
Go into ./TasksManager
### Setup

1. Create a .env file, paste the content of the .sample-env file in there and set the following environment variable
   1. `TOKEN` : a token for authentication
2. Execute `docker-compose build` to build the tasksmanager
3. Execute `docker-compose up -d` to run the tasksmanager in detached mode
4. The tasksmanager should run now on port 8686. If you want to change the port, you need to modify docker-compose.yml respectively.