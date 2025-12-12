using UnityEngine;
using UnityEngine.SceneManagement;

namespace Positron
{
    public class RoomJoinHandler : IClientMessageHandler
    {
        private RoomClient _roomClient;

        public string EventName => EventNamesHolder.JOINED_INTO_ROOM;

        public RoomJoinHandler(RoomClient roomClient)
        {
            _roomClient = roomClient;
        }

        public void Process(string data, PositronCallbacksPresenter presenter)
        {
            RoomJoinResponse response = JsonUtility.FromJson<RoomJoinResponse>(data);
            _roomClient.PerformJoin(response);

            presenter.ForEachView(view => 
            {
                view.OnRoomJoined(response);
            });
        }
    }
}