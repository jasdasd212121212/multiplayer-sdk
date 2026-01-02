using System;
using UnityEngine;

namespace Positron
{
    public class RemoveObjectHandler : IClientMessageHandler
    {
        public string EventName => "objectDeleted";

        public event Action<RemoveObjectResponse> objectDestroyed;

        public void Process(string data, PositronCallbacksPresenter presenter)
        {
            objectDestroyed?.Invoke(JsonUtility.FromJson<RemoveObjectResponse>(data));
        }
    }
}