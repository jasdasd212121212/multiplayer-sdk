using UnityEngine;

namespace Positron
{
    public class PositronNetworkObject : MonoBehaviour
    {
        private Vector3 _position;
        private Vector3 _rotation;

        private string _creationGuid = string.Empty;

        private bool _isInitialized;

        public int OwnerId { get; private set; } = -1;
        public int ObjectId { get; private set; } = -1;
        public int SubObjectId { get; private set; } = -1;
        public bool IsMine => OwnerId == PositronNetwork.Room.SelfId;
        public bool IsOwnedByHost => OwnerId == PositronNetwork.Room.HostId;

        public void Init(int ownerClientId, int objectId)
        {
            if (_isInitialized)
            {
                Debug.LogError($"Positron error -> can`t initialize '{name}' network object twice: OwnerID: {OwnerId} ObjectID: {ObjectId}");
                return;
            }

            if (GetComponentInParent<PositronNetworkObject>())
            {
                Debug.LogError($"Positron error -> can`t init sub object");
                return;
            }

            _position = transform.position;
            _rotation = transform.eulerAngles;
            OwnerId = ownerClientId;
            ObjectId = objectId;

            InitializeSubObjects();

            _isInitialized = true;
        }

        public void Init(int ownerClientId, string cguid)
        {
            if (GetComponentInParent<PositronNetworkObject>())
            {
                Debug.LogError($"Positron error -> can`t init sub object");
                return;
            }

            if (string.IsNullOrEmpty(_creationGuid) && !string.IsNullOrEmpty(cguid) && !_isInitialized)
            {
                Init(ownerClientId, -1);
                _creationGuid = cguid;
            }
        }

        public void InitObjectId(int objId)
        {
            if (ObjectId == -1 && objId != -1)
            {
                ObjectId = objId;
                InitializeSubObjects();
            }
        }

        public void TransferTo(int newOwner)
        {
            if (OwnerId != newOwner)
            {
                OwnerId = newOwner;
                InitializeSubObjects();
            }
        }

        public void Move(Vector3 newPosition, Vector3 newRotation)
        {
            _position = newPosition;
            _rotation = newRotation;
        }

        private void Update()
        {
            transform.SetPositionAndRotation(_position, Quaternion.Euler(_rotation));
        }

        private void InitializeSubObjects()
        {
            PositronNetworkObject[] subObjects = GetComponentsInChildren<PositronNetworkObject>();

            for (int i = 0; i < subObjects.Length; i++)
            {
                subObjects[i].SubObjectId = ObjectId + 1 + i;
            }
        }
    }
}