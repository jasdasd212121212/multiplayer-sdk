using UnityEngine;

namespace Positron
{
    public class GetRoomsHandler : IClientMessageHandler
    {
        public string EventName => EventNamesHolder.ROOMS_LIST;

        public void Process(string data)
        {
            Debug.Log(data);
        }
    }
}