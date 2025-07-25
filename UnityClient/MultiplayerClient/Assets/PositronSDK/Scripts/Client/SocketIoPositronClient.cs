using SocketIOClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SocketIOClient.Transport;

namespace Positron
{
    public class SocketIoPositronClient : IPositronClient
    {
        private List<IClientMessageHandler> _eventHandlers = new();
        private SocketIOUnity _socket;

        public bool IsConnected => _socket != null && _socket.Connected;

        public event Action connected;

        public void ConnectToMaster(ClientSettings settings)
        {
            Uri uri = new(settings.BuildURL());
            SocketIOOptions options = new();
            options.Transport = TransportProtocol.WebSocket;
            options.AutoUpgrade = false;
            options.EIO = EngineIO.V4;

            _socket = new SocketIOUnity(uri, options);
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
            _socket.On(handler.EventName, (SocketIOResponse data) =>
            {
                int length = data.Count;
                StringBuilder result = new();

                for (int i = 0; i < length; i++)
                {
                    result.Append(data.GetValue(i));
                }

                handler.Process(result.ToString());
            });
        }
    }
}