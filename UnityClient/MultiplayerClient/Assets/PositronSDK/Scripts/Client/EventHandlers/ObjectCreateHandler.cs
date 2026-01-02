using System;
using UnityEngine;

namespace Positron
{
    public class ObjectCreateHandler : IClientMessageHandler
    {
        public event Action<ObjectCreationResponseData> objectCreated;

        public string EventName => "objectCreated";

        public void Process(string data, PositronCallbacksPresenter presenter)
        {
            objectCreated?.Invoke(JsonUtility.FromJson<ObjectCreationResponseData>(data));
        }
    }
}