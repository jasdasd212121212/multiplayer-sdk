import { serverEventHandlerBase } from "./GameNetworking/Server/Handlers/Base/serverEventHandlerBase.js";
import { createObjectHandler } from "./GameNetworking/Server/Handlers/createObjectHandler.js";
import { roomCreationHandler } from "./GameNetworking/Server/Handlers/roomCreationHandler.js";
import { roomDisconnectHandler } from "./GameNetworking/Server/Handlers/roomDisconnectHandler.js";
import { roomJoinHandler } from "./GameNetworking/Server/Handlers/roomJoinHandler.js";
import { server } from "./GameNetworking/Server/server.js";

let gameServer: server = new server();
let handlers: Array<serverEventHandlerBase> = [];

handlers.push(new roomCreationHandler(gameServer));
handlers.push(new roomJoinHandler(gameServer));
handlers.push(new roomDisconnectHandler(gameServer));
handlers.push(new createObjectHandler(gameServer));

gameServer.initHandlers(handlers);
gameServer.start(); 