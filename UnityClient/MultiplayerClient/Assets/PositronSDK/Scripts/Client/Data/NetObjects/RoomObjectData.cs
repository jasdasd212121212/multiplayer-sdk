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
        [SerializeField] private NetVector3 p = new(0, 0, 0);
        [SerializeField] private NetVector3 r = new(0, 0, 0);

        public string PrefabAssetPath => a;
        public int ObjectId => i;
        public int OwnerClientId => c;
        public Vector3 Position => p.Vector;
        public Vector3 Rotation => r.Vector;
    }
}