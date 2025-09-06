using Cysharp.Threading.Tasks;
using System;
using UnityEngine;

namespace Positron
{
    public static class PositronNetwork
    {
        private static IPositronClient _client;
        private static SettingsLoader _settingsLoader;

        private static bool _initialized;

        public static bool IsConnectedToMaster => _client.IsConnected;

        public static void Initialize(IPositronClient client)
        {
            if (_initialized)
            {
                Debug.LogError($"Critical error -> can`t initialize twice");
                return;
            }

            _settingsLoader = new();
            _client = client;

            _client.AddHandler(new GetRoomsHandler());

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

            _client.Send(ReqestEventNamesHolder.GET_ROOMS_LIST, "");
        }

        private static void SendConnectedCallback()
        {
            _client.CallbacksPresenter.RefrashViews();
            _client.CallbacksPresenter.ForEachView((MonoBehaviourPositronCallbacks view) =>
            {
                view.OnConnectedToMaster();
            });
        }
    }
}