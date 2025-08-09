using Cysharp.Threading.Tasks;

namespace Positron
{
    public interface IUdpClient : IIncapsulatedUdpClient
    {
        UniTask Connect(int hostPort, int selfPort, string host);
        void Disconnect();

        void AddHandler(IUdpClientMessageHandler handler);
    }
}