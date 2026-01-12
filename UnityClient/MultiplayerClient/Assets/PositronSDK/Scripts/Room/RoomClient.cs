using Cysharp.Threading.Tasks;
using System;
using System.Threading;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Positron
{
    public sealed class RoomClient : IObservableRoomClient
    {
        private readonly RoomClientObjectsModel _objectsModel;
        private readonly RoomObjectsModififcationBuffer _modificationBuffer;

        private RoomJoinResponse _roomData;
        private CancellationTokenSource _tickLoopCancellationToken;

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
            RoomObjectsBatchedModificationHandler modificationHandler,
            IPositronClient transportClient)
        {
            _objectsModel = new();

            hostTransferHandler.hostTransfered += OnHostTransfer;
            objectsTansferHandler.objectsTransfered += OnObjectsTransfered;
            modificationHandler.receivedModificationBatch += OnReceiveObjectsModification;
            _modificationBuffer = new(transportClient);
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
            _tickLoopCancellationToken.Cancel();

            roomLeft?.Invoke();
        }

        public PositronNetworkObject SpawnObject(string assetPath, Vector3 position, Vector3 rotation)
        {
            PositronNetworkObject created = _objectsModel.Spawn(assetPath, _clientId, position, rotation, out string cguid);

            if (created == null)
            {
                return null;
            }

            _modificationBuffer.AddCreationRequest(new ObjectCreationRequest(assetPath, cguid, position, rotation));
            return created;
        }

        public void DestroyObject(PositronNetworkObject obj)
        {
            if (!InRoom || obj.ObjectId == -1)
            {
                Debug.LogError($"Positron error -> can`t destroy object InRoom: {InRoom} objID: {obj.ObjectId}");
                return;
            }

            if (obj.OwnerId != _clientId)
            {
                Debug.LogError($"Critical positron error -> can`t remove foreign object !!! Chek ownership !!!");
                return;
            }

            _objectsModel.DestroyObject(obj);
            _modificationBuffer.AddRemoveRequest(new RemoveObjectRequest(obj.ObjectId, _clientId));
        }

        private void OnSceneLoaded(Scene _, LoadSceneMode __)
        {
            _clientId = _roomData.SelfId;
            _hostId = _roomData.HostId;

            _objectsModel.SpawnMany(_roomData.Objects);

            InRoom = true;
            roomInitialized?.Invoke();

            _tickLoopCancellationToken = new();
            TickLoop().Forget();

            SceneManager.sceneLoaded -= OnSceneLoaded;
        }

        private async UniTask TickLoop()
        {
            await UniTask.SwitchToMainThread();

            while (InRoom)
            {
                await UniTask.WaitForSeconds(1f / _roomData.Tickrate, cancellationToken: _tickLoopCancellationToken.Token);
                _modificationBuffer.Flush();
            }
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

        private void OnReceiveObjectsModification(RoomObjectsModificationResponse response)
        {
            for (int i = 0; i < response.DeleteResponse.Length; i++)
            {
                if (!_objectsModel.ContainsObjectById(response.DeleteResponse[i].ObjectId))
                {
                    return;
                }

                _objectsModel.DestroyObject(_objectsModel.FindObjectById(response.DeleteResponse[i].ObjectId));
            }

            for (int i = 0; i < response.CreationResponse.Length; i++)
            {
                if (!_objectsModel.TryInitByCguid(response.CreationResponse[i].Cguid, response.CreationResponse[i].NetworkObjectData))
                {
                    _objectsModel.Spawn(response.CreationResponse[i].NetworkObjectData);
                }
            }
        }
    }
}