import path from "path";
import { CfgLoader } from "./CfgLoader/CfgLoader.js";
import { addOrModifyVariablesHandler } from "./GameNetworking/Server/Handlers/addOrModifyVariablesHandler.js";
import { serverEventHandlerBase } from "./GameNetworking/Server/Handlers/Base/serverEventHandlerBase.js";
import { changeRoomSceneHandler } from "./GameNetworking/Server/Handlers/changeRoomSceneHandler.js";
import { getRoomsListHandler } from "./GameNetworking/Server/Handlers/getRoomsListHandler.js";
import { raiseEventHandler } from "./GameNetworking/Server/Handlers/raiseEventHandler.js";
import { removeVariablesFromObjectHandler } from "./GameNetworking/Server/Handlers/removeVariablesFromObjectHandler.js";
import { roomCreationHandler } from "./GameNetworking/Server/Handlers/roomCreationHandler.js";
import { roomDisconnectHandler } from "./GameNetworking/Server/Handlers/roomDisconnectHandler.js";
import { roomJoinHandler } from "./GameNetworking/Server/Handlers/roomJoinHandler.js";
import { server } from "./GameNetworking/Server/server.js";
import { udpHandlerBase } from "./UDP/Handlers/Base/udpHandlerBase.js";
import { objectsUpdateHandler } from "./UDP/Handlers/objectsUpdateHandler.js";
import { UdpServer } from "./UDP/UdpServer.js";
import { ObjectsSerializeUtil } from "./Utils/ObjectsSerializeUtil.js";
import { socketMiddlewareBase } from "./GameNetworking/Server/Middlewares/Base/socketMiddlewareBase.js";
import { authKeyMiddleware } from "./GameNetworking/Server/Middlewares/authKeyMiddleware.js";
import { createOrDeleteObjectsHandler } from "./GameNetworking/Server/Handlers/createOrDeleteObjectsHandler.js";

CfgLoader.init(path.resolve("."));
ObjectsSerializeUtil.init();

let udpServer: UdpServer = new UdpServer();
let gameServer: server = new server(udpServer);

let handlers: Array<serverEventHandlerBase> = [];
let middlewares: Array<socketMiddlewareBase> = [];
let udpHandlers: Array<udpHandlerBase> = [];

handlers.push(new roomCreationHandler(gameServer));
handlers.push(new roomJoinHandler(gameServer));
handlers.push(new roomDisconnectHandler(gameServer));
handlers.push(new createOrDeleteObjectsHandler(gameServer));
handlers.push(new getRoomsListHandler(gameServer));
handlers.push(new raiseEventHandler(gameServer));
handlers.push(new changeRoomSceneHandler(gameServer));
handlers.push(new addOrModifyVariablesHandler(gameServer));
handlers.push(new removeVariablesFromObjectHandler(gameServer));

middlewares.push(new authKeyMiddleware());

udpHandlers.push(new objectsUpdateHandler(udpServer, gameServer));

udpServer.initHandlers(udpHandlers);
gameServer.initHandlers(handlers);
gameServer.initMiddlewares(middlewares);

gameServer.start(); 