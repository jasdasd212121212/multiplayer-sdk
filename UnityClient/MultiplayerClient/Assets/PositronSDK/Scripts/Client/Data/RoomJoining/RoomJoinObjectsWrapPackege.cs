using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class RoomJoinObjectsWrapPackege
    {
        [SerializeField] private RoomObjectData[] o;

        public RoomObjectData[] SceneObjectsFullSynced => o;
    }
}