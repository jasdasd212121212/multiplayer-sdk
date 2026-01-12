using System.Collections.Generic;
using UnityEngine;

namespace Positron
{
    public class RoomObjectsModififcationBuffer
    {
        private readonly List<ObjectCreationRequest> _createRequests = new();
        private readonly List<RemoveObjectRequest> _deleteRequests = new();
        private readonly IPositronClient _transportClient;

        public RoomObjectsModififcationBuffer(IPositronClient transportClient)
        {
            _transportClient = transportClient;
        }

        public void AddCreationRequest(ObjectCreationRequest creation)
        {
            if (_createRequests.Contains(creation))
            {
                Debug.LogError($"Positron error -> can`t add creation object to buffer twice !!!");
                return;
            }

            _createRequests.Add(creation);
        }

        public void AddRemoveRequest(RemoveObjectRequest deletion)
        {
            if (_deleteRequests.Contains(deletion))
            {
                Debug.LogError($"Positron error -> can`t add deletion object to buffer twice !!!");
                return;
            }

            _deleteRequests.Add(deletion);
        }

        public void Flush()
        {
            if (_createRequests.Count == 0 && _deleteRequests.Count == 0)
            {
                return;
            }

            _transportClient.Send(RequestEventNamesHolder.ROOM_OBJECTS_MODIFICATION, new RoomObjectsModificationRequest(_createRequests.ToArray(), _deleteRequests.ToArray()));
            _createRequests.Clear();
            _deleteRequests.Clear();
        }
    }
}