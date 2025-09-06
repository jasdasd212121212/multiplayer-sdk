using UnityEngine;

namespace Positron
{
    public class GetRoomsHandler : IClientMessageHandler
    {
        private RoomsListData _currentRooms;

        public string EventName => EventNamesHolder.ROOMS_LIST;

        public void Process(string data, MonoBehaviourPositronCallbacksPresenter presenter)
        {
            _currentRooms = JsonUtility.FromJson<RoomsListData>(data);
            presenter.ForEachView(ProcessView);
        }

        private void ProcessView(MonoBehaviourPositronCallbacks view)
        {
            view.OnRoomsListReceived(_currentRooms);
        }
    }
}