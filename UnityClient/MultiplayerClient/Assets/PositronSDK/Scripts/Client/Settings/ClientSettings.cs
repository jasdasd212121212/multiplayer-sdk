using UnityEngine;

namespace Positron
{
    [CreateAssetMenu(fileName = "ClientSettings", menuName = "PositronSDK/ClientSettings")]
    public class ClientSettings : ScriptableObject
    {
        [SerializeField] private string _protocol = "ws";
        [SerializeField] private string _remoteServerAddress = "localhost";
        [SerializeField][Min(1)] private int _port = 7000;
        [SerializeField][Min(2)] private int _udpPort = 7001;

        public string Protocol => _protocol;
        public string RemoteServerAddress => _remoteServerAddress;
        public int Port => _port;
        public int UdpPort => _udpPort;

        public string BuildURL()
        {
            return $"{Protocol}://{RemoteServerAddress}:{Port}";
        }
    }
}