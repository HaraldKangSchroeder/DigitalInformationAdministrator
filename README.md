# DIA - Digital Information Administrator

DIA is a private project of mine to improve the management of home relevant tasks. 
It consists of 4 main components
* the frontend provider (mandatory since it serves the webpage)
* tasksmanager
* weatherservice
* grocery cart 

## App features

https://user-images.githubusercontent.com/81776044/137016795-5c32ee22-8370-4d19-a9bb-44381a9dd85c.mp4

https://user-images.githubusercontent.com/81776044/137016838-432ab567-310e-4a36-967b-bc1b27831683.mp4

https://user-images.githubusercontent.com/81776044/137016873-c046c20d-89f6-4a89-a6bd-65a178a61870.mp4

https://user-images.githubusercontent.com/81776044/137016931-71c8d437-6999-422e-9264-79b7a9153ec6.mp4

## Management features

https://user-images.githubusercontent.com/81776044/137017624-abce746e-9598-4e68-a1d1-a2f1f47d15db.mp4

https://user-images.githubusercontent.com/81776044/137017688-307930ed-0a67-4184-a137-2baa8481ef20.mp4

https://user-images.githubusercontent.com/81776044/137017714-00dbb4a9-9ac1-4895-9e31-b624ce72e541.mp4

## Setup

Only the frontend provider (step 4) is mandatory, which can be extended by the other 3 components (step 1-3).  

All components come along with Docker, specifically with docker-compose  
You need to install those first - see https://docs.docker.com/compose/install/. You also need an account on Docker Hub ([https://hub.docker.com/](https://hub.docker.com/)).

1. If you want to use the tasksmanager, use [this guide](./TasksManager/README.md)
2. If you want to use the grocerycart, use [this guide](./GroceryCart/README.md)
3. If you want to use the weather service, use [this guide](./WeatherService/README.md)
4. Use [this guide](./FrontendProvider/README.md) in order to setup the frontend provider

## Personal Setup
My application is constantly running (in detached mode) on a raspberry pi 4 which is attached to a touchdisplay (https://www.sunfounder.com/products/10inch-touchscreen-for-raspberrypi). To attach both components on a surface, I created a case using a 3d printer.

