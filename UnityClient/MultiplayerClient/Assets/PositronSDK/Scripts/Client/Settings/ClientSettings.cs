using UnityEngine;

namespace Positron
{
    [CreateAssetMenu(fileName = "ClientSettings", menuName = "PositronSDK/ClientSettings")]
    public class ClientSettings : ScriptableObject
    {
        [SerializeField] private string _protocol = "ws";
        [SerializeField] private string _remoteServerAddress = "localhost";
        [SerializeField][Min(1)] private int _port = 7000;

        public string Protocol => _protocol;
        public string RemoteServerAddress => _remoteServerAddress;
        public int Port => _port;

        public string BuildURL()
        {
            return $"{Protocol}://{RemoteServerAddress}:{Port}";
        }
    }
}