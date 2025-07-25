import { serverEventHandlerBase } from "./GameNetworking/Server/Handlers/Base/serverEventHandlerBase.js";
import { createObjectHandler } from "./GameNetworking/Server/Handlers/createObjectHandler.js";
import { getRoomsListHandler } from "./GameNetworking/Server/Handlers/getRoomsListHandler.js";
import { objectsUpdateHandler } from "./GameNetworking/Server/Handlers/objectsUpdateHandler.js";
import { raiseEventHandler } from "./GameNetworking/Server/Handlers/raiseEventHandler.js";
import { removeObjectHandler } from "./GameNetworking/Server/Handlers/removeObjectHandler.js";
import { roomCreationHandler } from "./GameNetworking/Server/Handlers/roomCreationHandler.js";
import { roomDisconnectHandler } from "./GameNetworking/Server/Handlers/roomDisconnectHandler.js";
import { roomJoinHandler } from "./GameNetworking/Server/Handlers/roomJoinHandler.js";
import { server } from "./GameNetworking/Server/server.js";
import { JsonCompressor } from "./Utils/JsonCompressor.js";

JsonCompressor.init();

let gameServer: server = new server();
let handlers: Array<serverEventHandlerBase> = [];

handlers.push(new roomCreationHandler(gameServer));
handlers.push(new roomJoinHandler(gameServer));
handlers.push(new roomDisconnectHandler(gameServer));
handlers.push(new createObjectHandler(gameServer));
handlers.push(new objectsUpdateHandler(gameServer));
handlers.push(new removeObjectHandler(gameServer));
handlers.push(new getRoomsListHandler(gameServer));
handlers.push(new raiseEventHandler(gameServer));

gameServer.initHandlers(handlers);
gameServer.start(); 