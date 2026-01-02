using System;
using UnityEngine;

namespace Positron
{
    [Serializable]
    public class ObjectsTransferResponse
    {
        [SerializeField] private int tarnsferedToClient;
        [SerializeField] private int[] objects;

        public int NewObjectsOwnerClientId => tarnsferedToClient;
        public int[] ObjectIds => objects;
    }
}