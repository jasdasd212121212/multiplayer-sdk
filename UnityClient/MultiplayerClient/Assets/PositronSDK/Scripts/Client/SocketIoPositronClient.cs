using SocketIOClient;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Positron
{
    public class SocketIoPositronClient : IPositronClient
    {
        private List<IClientMessageHandler> _eventHandlers = new();
        private SocketIOUnity _socket;

        public event Action connected;

        public void ConnectToMaster(ClientSettings settings)
        {
            Uri uri = new(settings.BuildURL());
            _socket = new SocketIOUnity(uri);
            _socket.ConnectAsync();

            _socket.On(EventNamesHolder.CONNECTED, (data) =>
            {
                BindHandlersToSocket();
                connected?.Invoke();
            });
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

            if (_socket.Connected)
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
            _socket.On(handler.EventName, (SocketIOResponse data) =>
            {
                handler.Process(data.ToString());
            });
        }
    }
}