using System;
using UnityEngine;

namespace Positron
{
    public class RoomObjectsTranferHandler : IClientMessageHandler
    {
        public string EventName => "roomObjectsTransfered";

        public event Action<ObjectsTransferResponse> objectsTransfered;

        public void Process(string data, PositronCallbacksPresenter presenter)
        {
            ObjectsTransferResponse transferResponse = JsonUtility.FromJson<ObjectsTransferResponse>(data);
            objectsTransfered?.Invoke(transferResponse);
        }
    }
}