using UnityEngine;

namespace Positron
{
    public abstract class MonoBehaviourPositronCallbacks : MonoBehaviour, IPositronCallbackable
    {
        public virtual void OnRoomsListReceived(RoomsListData rooms) { }
        public virtual void OnConnectedToMaster() { }
        public virtual void OnRoomCreated(RoomCreationResponse createdRoomResponse) { }
    }
}