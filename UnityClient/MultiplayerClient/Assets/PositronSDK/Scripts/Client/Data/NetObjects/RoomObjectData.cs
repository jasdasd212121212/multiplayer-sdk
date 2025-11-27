using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class RoomObjectData
    {
        [SerializeField] private string a = string.Empty;
        [SerializeField] private int i = -1;
        [SerializeField] private int c = -1;
        [SerializeField] private Vector3 p = Vector3.zero;
        [SerializeField] private Vector3 r = Vector3.zero;

        public string PrefabAssetPath => a;
        public int ObjectId => i;
        public int OwnerClientId => c;
        public Vector3 Position => p;
        public Vector3 Rotation => r;
    }
}