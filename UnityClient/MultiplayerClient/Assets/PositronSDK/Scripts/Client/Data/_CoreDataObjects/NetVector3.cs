using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public struct NetVector3
    {
        [SerializeField] private float x;
        [SerializeField] private float y;
        [SerializeField] private float z;

        public readonly Vector3 Vector => new(x, y, z);

        public NetVector3(float x, float y, float z)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
}