using UnityEngine;

namespace Positron
{
    public class MonoBehaviourPositronCallbacks : MonoBehaviour
    {
        public virtual void OnRoomsListReceived(RoomsListData rooms) { }
        public virtual void OnConnectedToMaster() { }
        public virtual void OnRoomCreated(RoomCreationResponse createdRoomResponse) { }
    }
}