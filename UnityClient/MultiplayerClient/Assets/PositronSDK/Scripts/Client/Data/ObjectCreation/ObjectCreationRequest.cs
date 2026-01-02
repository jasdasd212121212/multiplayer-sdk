using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class ObjectCreationRequest
    {
        [SerializeField] private string asset;
        [SerializeField] private string cguid;
        [SerializeField] private Vector3 position;
        [SerializeField] private Vector3 rotation;

        public ObjectCreationRequest(string assetPath, string cguid, Vector3 position, Vector3 rotation)
        {
            asset = assetPath;
            this.cguid = cguid;
            this.position = position;
            this.rotation = rotation;
        }
    }
}