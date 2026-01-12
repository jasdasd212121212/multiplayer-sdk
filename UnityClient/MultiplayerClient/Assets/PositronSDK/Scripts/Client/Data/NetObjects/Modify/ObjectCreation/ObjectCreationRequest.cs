using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class ObjectCreationRequest
    {
        [SerializeField] private string asset;
        [SerializeField] private string cguid;
        [SerializeField] private NetVector3 position;
        [SerializeField] private NetVector3 rotation;

        public ObjectCreationRequest(string assetPath, string cguid, Vector3 position, Vector3 rotation)
        {
            asset = assetPath;
            this.cguid = cguid;
            this.position = new(position.x, position.y, position.z);
            this.rotation = new(rotation.x, rotation.y, rotation.z);
        }
    }
}