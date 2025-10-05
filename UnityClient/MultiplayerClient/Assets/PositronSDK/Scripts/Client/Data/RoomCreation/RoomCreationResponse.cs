using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class RoomCreationResponse
    {
        [SerializeField] private string createdRoomId;

        public string CreatedRoomID => createdRoomId;

        public RoomCreationResponse(string createdRoomId)
        {
            this.createdRoomId = createdRoomId;
        }
    }
}