using System;
using UnityEngine;

namespace Positron
{
    [Serializable]
    public class RemoveObjectRequest
    {
        [SerializeField] private int id;
        [SerializeField] private int client;

        public RemoveObjectRequest(int objId, int clientId)
        {
            id = objId;
            client = clientId;
        }
    }
}