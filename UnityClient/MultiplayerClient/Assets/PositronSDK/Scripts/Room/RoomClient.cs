using System;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Positron
{
    public sealed class RoomClient : IObservableRoomClient
    {
        private readonly RoomClientObjectsModel _objectsModel;
        private readonly IPositronClient _transportClient;

        private RoomJoinResponse _roomData;

        private int _clientId;
        private int _hostId;

        public bool IsHost => _hostId == _clientId;
        public int SelfId => _clientId;
        public int HostId => _hostId;
        public bool InRoom { get; private set; }

        public event Action roomInitialized;
        public event Action roomLeft;

        public RoomClient(
            RoomHostTransferHandler hostTransferHandler, 
            RoomObjectsTranferHandler objectsTansferHandler, 
            RemoveObjectHandler objectRemoveHandler, 
            IPositronClient transportClient)
        {
            _objectsModel = new();

            hostTransferHandler.hostTransfered += OnHostTransfer;
            objectsTansferHandler.objectsTransfered += OnObjectsTransfered;
            objectRemoveHandler.objectDestroyed += OnObjectRemoved;
            _transportClient = transportClient;
        }

        public void PerformJoin(RoomJoinResponse data)
        {
            _roomData = data;
            SceneManager.sceneLoaded += OnSceneLoaded;
            SceneManager.LoadScene(_roomData.SceneIndex);
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

        public PositronNetworkObject SpawnObject(PositronNetworkObject prefab)
        {
            return null;
        }

        public void DestroyObject(PositronNetworkObject obj)
        {
            if (InRoom || obj.ObjectId == -1)
            {
                Debug.LogError($"Positron error -> can`t destroy object InRoom: {InRoom} objID: {obj.ObjectId}");
                return;
            }

            _objectsModel.DestroyObject(obj);
            _transportClient.Send(RequestEventNamesHolder.DELETE_OBJECT, new RemoveObjectRequest(obj.ObjectId, _clientId));
        }

        private void OnSceneLoaded(Scene _, LoadSceneMode __)
        {
            _clientId = _roomData.SelfId;
            _hostId = _roomData.HostId;

            _objectsModel.SpawnMany(_roomData.Objects);

            InRoom = true;
            roomInitialized?.Invoke();

            SceneManager.sceneLoaded -= OnSceneLoaded;
        }

        private void OnHostTransfer(int newHost)
        {
            _hostId = newHost;    
        }

        private void OnObjectsTransfered(ObjectsTransferResponse transferData)
        {
            for (int i = 0; i < transferData.ObjectIds.Length; i++)
            {
                int currentId = transferData.ObjectIds[i];
                PositronNetworkObject networkObject = _objectsModel.FindObjectById(currentId);

                if (networkObject != null)
                {
                    networkObject.TransferTo(transferData.NewObjectsOwnerClientId);
                }
            }
        }

        private void OnObjectRemoved(RemoveObjectResponse response)
        {
            if (_objectsModel.ContainsObjectById(response.ObjectId))
            {
                return;
            }

            _objectsModel.DestroyObject(_objectsModel.FindObjectById(response.ObjectId));
        }
    }
}