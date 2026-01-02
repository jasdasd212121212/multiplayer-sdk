using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class HostTransferResponse
    {
        [SerializeField] private int targetId;

        public int NewHostId => targetId;
    }
}