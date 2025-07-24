using System;

namespace Positron
{
    public interface IPositronClient
    {
        event Action connected;

        void ConnectToMaster(ClientSettings settings);
        void Send(string name, string content);

        void AddHandler(IClientMessageHandler handler);
        T GetHandler<T>() where T : IClientMessageHandler;
    }
}