using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class ObjectCreationResponseData
    {
        [SerializeField] private string cguid;
        [SerializeField] private RoomObjectData data;

        public string Cguid => cguid;
        public RoomObjectData NetworkObjectData => data;
    }
}