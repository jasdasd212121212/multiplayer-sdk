using SocketIOClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using SocketIOClient.Transport;
using UnityEngine;
using Cysharp.Threading.Tasks;

namespace Positron
{
    public class SocketIoPositronClient : IPositronClient
    {
        private List<IClientMessageHandler> _eventHandlers = new();
        private SocketIOUnity _socket;
        private BrotlitInteractor _interactor;
        private ConnectionObjectKernel _connectionObjectKernel;
        private PositronUdpClient _udpClient;

        public bool IsConnected => _socket != null && _socket.Connected;
        public IIncapsulatedUdpClient UdpSubClient => _udpClient;

        public event Action connected;

        public SocketIoPositronClient()
        {
            _udpClient = new PositronUdpClient();
        }

        ~SocketIoPositronClient()
        {
            if (_connectionObjectKernel != null && IsConnected)
            {
                _connectionObjectKernel.kernelDestroyed -= OnKernelDestroy;
            }
        }

        public void ConnectToMaster(ClientSettings settings)
        {
            _interactor = new();
            _connectionObjectKernel = new GameObject("PositronKernel").AddComponent<ConnectionObjectKernel>();

            Uri uri = new(settings.BuildURL());
            SocketIOOptions options = new();
            options.Transport = TransportProtocol.WebSocket;
            options.AutoUpgrade = false;
            options.EIO = EngineIO.V4;

            _socket = new SocketIOUnity(uri, options);
            _socket.ConnectAsync();

            _socket.On(EventNamesHolder.CONNECTED, (SocketIOResponse data) =>
            {
                ProcessConnectionWithSubCient(settings, data).Forget();
            });
        }

        public void Send(string name, string content)
        {
            if (_socket.Connected)
            {
                _socket.EmitAsync(name, _interactor.CompressString(content));
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
                handler.Process(ParseSocketIoResponse(data));
            });
        }

        private void OnKernelDestroy()
        {
            if (IsConnected)
            {
                _socket.Disconnect();
                _socket.Dispose();
                _udpClient.Disconnect();
            }
        }

        private string ParseSocketIoResponse(SocketIOResponse data)
        {
            int length = data.Count;
            StringBuilder result = new();

            for (int i = 0; i < length; i++)
            {
                result.Append(data.GetValue(i));
            }

            return _interactor.DecompressString(result.ToString()); 
        }

        private async UniTask ProcessConnectionWithSubCient(ClientSettings settings, SocketIOResponse data)
        {
            InitialSocketIoMessageData response = JsonUtility.FromJson<InitialSocketIoMessageData>(ParseSocketIoResponse(data));
            await _udpClient.Connect(settings.UdpPort, response.UdpPort, settings.RemoteServerAddress);

            BindHandlersToSocket();
            connected?.Invoke();

            _connectionObjectKernel.kernelDestroyed += OnKernelDestroy;
        }
    }
}