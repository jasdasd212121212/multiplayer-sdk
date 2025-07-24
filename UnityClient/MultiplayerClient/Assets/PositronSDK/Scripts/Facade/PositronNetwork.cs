using Cysharp.Threading.Tasks;
using System;
using System.Threading;
using UnityEngine;

namespace Positron
{
    public static class PositronNetwork
    {
        private static IPositronClient _client;
        private static SettingsLoader _settingsLoader;

        private static bool _initialized;

        public static void Initialize(IPositronClient client)
        {
            if (_initialized)
            {
                Debug.LogError($"Critical error -> can`t initialize twice");
                return;
            }

            _settingsLoader = new();
            _client = client;

            _initialized = true;
        }

        public static void ConnectToMasterServer(Action connectCallback)
        {
            _client.ConnectToMaster(_settingsLoader.Load());
            _client.connected += () => 
            { 
                connectCallback?.Invoke(); 
            };
        }

        public static async UniTask ConnectToMaster()
        {
            bool connected = false;

            _client.ConnectToMaster(_settingsLoader.Load());
            _client.connected += () =>
            {
                connected = true;
            };

            await UniTask.WaitWhile(() => !connected);
        }
    }
}