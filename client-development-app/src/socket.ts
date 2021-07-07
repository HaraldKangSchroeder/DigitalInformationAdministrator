import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

let socket : Socket<DefaultEventsMap, DefaultEventsMap>;
if(process.env.REACT_APP_SOCKET_PATH){
    socket = io({path : process.env.REACT_APP_SOCKET_PATH});
}
else{
    socket = io();
}

export default socket;
