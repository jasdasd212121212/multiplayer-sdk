using UnityEngine;

namespace Positron.Demo
{
    public class RoomsBrowserModel : MonoBehaviourPositronCallbacks
    {
        public override void OnConnectedToMaster()
        {
            PositronNetwork.FetchRoomsList();
        }

        public override void OnRoomsListReceived(RoomsListData rooms)
        {
            foreach (RoomsListDataEntry room in rooms.Rooms)
            {
                Debug.Log($"Room: {room.Name} \n ID: {room.Guid} \n Players: {room.CurrentPlayersCount}/{room.MaxPlayersCount}");
            }
        }
    }
}