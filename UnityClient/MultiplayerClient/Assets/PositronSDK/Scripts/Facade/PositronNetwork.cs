using Cysharp.Threading.Tasks;
using System;
using UnityEngine;

namespace Positron
{
    public static class PositronNetwork
    {
        private static IPositronClient _client;
        private static SettingsLoader _settingsLoader;
        private static RoomClient _roomClient;

        private static bool _initialized;

        public static bool IsConnectedToMaster => _client.IsConnected;
        public static bool IsHost => _roomClient.IsHost;
        public static bool InRoom => _roomClient.InRoom;
        public static IObservableRoomClient Room => _roomClient;

        public static void Initialize(IPositronClient client)
        {
            if (_initialized)
            {
                Debug.LogError($"Critical error -> can`t initialize twice");
                return;
            }

            _settingsLoader = new();
            _client = client;

            RoomHostTransferHandler hostTransferHandler = new();
            RoomObjectsTranferHandler objectsTansferHandler = new();
            RemoveObjectHandler objectRemoveHandler = new();

            _roomClient = new(hostTransferHandler, objectsTansferHandler, objectRemoveHandler, _client);

            _client.AddHandler(new GetRoomsHandler());
            _client.AddHandler(new RoomCreationHandler());
            _client.AddHandler(new RoomJoinHandler(_roomClient));
            _client.AddHandler(hostTransferHandler);
            _client.AddHandler(objectsTansferHandler);

            _initialized = true;
        }

        public static void ConnectToMasterServer(Action connectCallback)
        {
            if (_client.IsConnected)
            {
                return;
            }

            _client.ConnectToMaster(_settingsLoader.Load());
            _client.connected += () => 
            { 
                connectCallback?.Invoke();
                SendConnectedCallback();
            };
        }

        public static async UniTask ConnectToMasterServer()
        {
            if (_client.IsConnected)
            {
                return;
            }

            bool connected = false;

            _client.ConnectToMaster(_settingsLoader.Load());
            _client.connected += () =>
            {
                connected = true;
            };

            await UniTask.WaitWhile(() => !connected);

            SendConnectedCallback();
        }

        public static void Disconnect()
        {
            if (InRoom)
            {
                _roomClient.LeaveRoom();
            }

            _client.DisconnectFromMaster();
        }

        public static T GetHandler<T>() where T : IClientMessageHandler
        {
            return _client.GetHandler<T>();
        }

        public static void FetchRoomsList()
        {
            if (!_client.IsConnected)
            {
                return;
            }

            _client.Send(RequestEventNamesHolder.GET_ROOMS_LIST, "");
        }

        public static void CreateRoom(string name, int sceneIndex, int maxPlayers, object externalData = null)
        {
            if (!_client.IsConnected)
            {
                return;
            }

            _client.Send(RequestEventNamesHolder.CREATE_ROOM, new RoomCreationRequestData(name, sceneIndex, maxPlayers, externalData));
        }

        public static void JoinRoom(string id)
        {
            _client.Send(RequestEventNamesHolder.JOIN_ROOM, new RoomJoinRequest(id));
        }

        public static void LeaveRoom()
        {
            _client.Send(RequestEventNamesHolder.LEAVE_ROOM, "");
            _roomClient.LeaveRoom();
        }

        public static PositronNetworkObject SpawnObject(PositronNetworkObject prefab)
        {
            return _roomClient.SpawnObject(prefab);
        }

        public static void DestroyObject(PositronNetworkObject obj)
        {
            _roomClient.DestroyObject(obj);
        }

        public static void AddPositronView(IPositronCallbackable view)
        {
            _client.CallbacksPresenter.AddView(view);
        }

        public static void RemovePositronView(IPositronCallbackable view)
        {
            _client.CallbacksPresenter.RemoveView(view);
        }

        private static void SendConnectedCallback()
        {
            _client.CallbacksPresenter.RefrashViews();
            _client.CallbacksPresenter.ForEachView((IPositronCallbackable view) =>
            {
                view.OnConnectedToMaster();
            });
        }
    }
}