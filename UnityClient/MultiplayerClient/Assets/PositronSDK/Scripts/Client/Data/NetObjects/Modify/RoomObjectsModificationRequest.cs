using System;
using UnityEngine;

namespace Positron
{
    [Serializable]
    public class RoomObjectsModificationRequest
    {
        [SerializeField] private ObjectCreationRequest[] creation;
        [SerializeField] private RemoveObjectRequest[] deletion;

        public RoomObjectsModificationRequest(ObjectCreationRequest[] creation, RemoveObjectRequest[] deletion)
        {
            this.creation = creation;
            this.deletion = deletion;
        }
    }
}