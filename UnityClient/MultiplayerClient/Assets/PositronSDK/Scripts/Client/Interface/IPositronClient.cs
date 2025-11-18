using System;

namespace Positron
{
    public interface IPositronClient
    {
        bool IsConnected { get; }
        IIncapsulatedUdpClient UdpSubClient { get; }
        MonoBehaviourPositronCallbacksPresenter CallbacksPresenter { get; }

        event Action connected;
        event Action disconnected;

        void ConnectToMaster(ClientSettings settings);
        void DisconnectFromMaster();
        void Send(string name, string content);
        void Send(string name, object content);

        void AddHandler(IClientMessageHandler handler);
        T GetHandler<T>() where T : IClientMessageHandler;
    }
}