using UnityEngine;

namespace Positron.Demo
{
    public class RoomsBrowserModel : MonoBehaviourPositronCallbacks
    {
        public override void OnConnectedToMaster()
        {
            PositronNetwork.FetchRoomsList();
        }

        public void CreateRoom(string name, int scene, int maxPlayersCount, object data = null)
        {
            PositronNetwork.CreateRoom(name, scene, maxPlayersCount, data);
            PositronNetwork.FetchRoomsList();
        }

        public void JoinRoom(string id)
        {
            Debug.Log("TODO: make joining room");
        }
    }
}