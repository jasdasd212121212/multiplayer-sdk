using Positron;
using UnityEngine;

public class RoomCreationHandler : IClientMessageHandler
{
    public string EventName => EventNamesHolder.ROOM_CREATED;

    public void Process(string data, PositronCallbacksPresenter presenter)
    {
        RoomCreationResponse response = JsonUtility.FromJson<RoomCreationResponse>(data);
        presenter.ForEachView(view => { view.OnRoomCreated(response); });
    }
}