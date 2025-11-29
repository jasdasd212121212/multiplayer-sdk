using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class InitialSocketIoMessageData
    {
        [SerializeField] private string udp;

        public string UdpUUID => udp;
    }
}