using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class RaiseEventData
    {
        [SerializeField] private int type;
        [SerializeField] private int targets;
        [SerializeField] private int sourceObjectId;
        [SerializeField] private int additionalIndex;
        [SerializeField] private int targetClient;
        [SerializeField] private object payload;

        public int Type => type;
        public int TargetType => targets;
        public int SourceObjectId => sourceObjectId;
        public int AdditionalIndex => additionalIndex;
        public int TargetClient => targetClient;

        public bool TryReadPayload<T>(out T readed) where T : class
        {
            if (payload is not T)
            {
                readed = null;
                return false;
            }

            readed = payload as T;
            return true;
        }
    }
}