using UnityEngine;

namespace Positron
{
    public class RoomJoinHandler : IClientMessageHandler
    {
        public string EventName => EventNamesHolder.JOINED_INTO_ROOM;

        public void Process(string data, PositronCallbacksPresenter presenter)
        {
            RoomJoinResponse response = JsonUtility.FromJson<RoomJoinResponse>(data);

            // make here stuff of init scene, variables and events etc.

            presenter.ForEachView(view => 
            {
                view.OnRoomJoined(response);
            });
        }
    }
}