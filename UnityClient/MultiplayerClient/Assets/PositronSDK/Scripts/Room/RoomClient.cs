using System;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Positron
{
    public class RoomClient : IObservableRoomClient
    {
        private RoomClientObjectsModel _objectsModel;
        private RoomJoinResponse _roomData;

        private int _clientId;
        private int _hostId;

        public bool IsHost => _hostId == _clientId;
        public int SelfId => _clientId;
        public int HostId => _hostId;
        public bool InRoom { get; private set; }

        public event Action roomInitialized;
        public event Action roomLeft;

        public RoomClient()
        {
            _objectsModel = new();
        }

        public void PerformJoin(RoomJoinResponse data)
        {
            _roomData = data;
            SceneManager.sceneLoaded += OnSceneLoaded;
            SceneManager.LoadScene(_roomData.SceneIndex);
        }

        private void OnSceneLoaded(Scene arg0, LoadSceneMode arg1)
        {
            _clientId = _roomData.SelfId;
            _hostId = _roomData.HostId;

            _objectsModel.SpawnMany(_roomData.Objects);

            InRoom = true;
            roomInitialized?.Invoke();

            SceneManager.sceneLoaded -= OnSceneLoaded;
        }

        public void LeaveRoom()
        {
            if (!InRoom)
            {
                Debug.LogError($"Positron error -> can`t leave room before join");
                return;
            }

            InRoom = false;
            roomLeft?.Invoke();
        }
    }
}