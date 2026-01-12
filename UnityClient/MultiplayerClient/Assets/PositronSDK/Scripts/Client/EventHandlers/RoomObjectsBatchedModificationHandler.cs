using System;
using UnityEngine;

namespace Positron
{
    public class RoomObjectsBatchedModificationHandler : IClientMessageHandler
    {
        public string EventName => "objectActBatched";

        public event Action<RoomObjectsModificationResponse> receivedModificationBatch;

        public void Process(string data, PositronCallbacksPresenter presenter)
        {
            RoomObjectsModificationResponse response = JsonUtility.FromJson<RoomObjectsModificationResponse>(data);
            receivedModificationBatch?.Invoke(response);
        }
    }
}