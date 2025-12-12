using UnityEngine;

namespace Positron
{
    public class PositronNetworkObject : MonoBehaviour
    {
        private Vector2 _position;
        private Vector3 _rotation;

        private string _creationGuid = string.Empty;

        private bool _isInitialized;

        public int OwnerId { get; private set; } = -1;
        public int ObjectId { get; private set; } = -1;
        public bool IsMine => OwnerId == PositronNetwork.Room.SelfId;
        public bool IsOwnedByHost => OwnerId == PositronNetwork.Room.HostId;
    
        public void Init(int ownerClientId, int objectId)
        {
            if (_isInitialized)
            {
                Debug.LogError($"Positron error -> can`t initialize '{name}' network object twice: OwnerID: {OwnerId} ObjectID: {ObjectId}");
                return;
            }

            _position = transform.position;
            _rotation = transform.eulerAngles;
            OwnerId = ownerClientId;
            ObjectId = objectId;
        
            _isInitialized = true;
        }

        public void Init(int ownerClientId, string cguid)
        {
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
            }
        }

        public void TransferTo(int newOwner)
        {
            if (OwnerId != newOwner)
            {
                OwnerId = newOwner;
            }
        }

        public void Move(Vector3 newPosition, Vector3 newRotation)
        {
            _position = newPosition;
            _rotation = newRotation;
        }

        private void Update()
        {
            transform.position = _position;
            transform.rotation = Quaternion.Euler(_rotation);
        }
    }
}