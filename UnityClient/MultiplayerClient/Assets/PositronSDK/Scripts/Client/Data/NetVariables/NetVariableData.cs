using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class NetVariableData
    {
        [SerializeField] private string id;
        [SerializeField] private object data;

        public string Id => id;

        public bool TryReadPayload<T>(out T readed) where T : class
        {
            if (data is not T)
            {
                readed = null;
                return false;
            }

            readed = data as T;
            return true;
        }
    }
}