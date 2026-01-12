using System;
using UnityEngine;

namespace Positron
{
    [Serializable]
    public class RoomObjectsModificationResponse
    {
        [SerializeField] private ObjectCreationResponseData[] created;
        [SerializeField] private RemoveObjectResponse[] deleted;

        public ObjectCreationResponseData[] CreationResponse => created;
        public RemoveObjectResponse[] DeleteResponse => deleted;
    }
}