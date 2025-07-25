using System;
using System.Collections.Generic;
using System.Linq;

namespace Positron
{
    public class SocketIoPositronClient : IPositronClient
    {
        private List<IClientMessageHandler> _eventHandlers = new();
        private SocketIOClientWithPerMessageDeflate.SocketIOClient _socket;

        public bool IsConnected => _socket != null && _socket.Connected;

        public event Action connected;

        public void ConnectToMaster(ClientSettings settings)
        {
            _socket = new SocketIOClientWithPerMessageDeflate.SocketIOClient(settings.BuildURL());

            _socket.On(EventNamesHolder.CONNECTED, (data) =>
            {
                BindHandlersToSocket();
                connected?.Invoke();
            });

            _socket.ConnectAsync();
        }

        public void Send(string name, string content)
        {
            if (_socket.Connected)
            {
                _socket.EmitAsync(name, content);
            }
        }

        public void AddHandler(IClientMessageHandler handler)
        {
            _eventHandlers.Add(handler);

            if (IsConnected)
            {
                BindHandlerToSocket(handler);
            }
        }

        public T GetHandler<T>() where T : IClientMessageHandler
        {
            return (T)_eventHandlers.Where(client => client.GetType() == typeof(T)).First();
        }

        private void BindHandlersToSocket()
        {
            foreach (IClientMessageHandler handler in _eventHandlers)
            {
                BindHandlerToSocket(handler);
            }
        }

        private void BindHandlerToSocket(IClientMessageHandler handler)
        {
            _socket.On(handler.EventName, (string data) =>
            {
                handler.Process(data);
            });
        }
    }
}