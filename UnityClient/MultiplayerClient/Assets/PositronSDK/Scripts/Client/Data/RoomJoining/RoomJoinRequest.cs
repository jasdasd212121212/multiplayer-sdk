using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class RoomJoinRequest
    {
        [SerializeField] private string id;

        public RoomJoinRequest(string id)
        {
            this.id = id;
        }
    }
}