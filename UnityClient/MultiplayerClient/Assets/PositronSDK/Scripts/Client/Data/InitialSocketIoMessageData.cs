using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class InitialSocketIoMessageData
    {
        [SerializeField] private int udp;

        public int UdpPort => udp;
    }
}