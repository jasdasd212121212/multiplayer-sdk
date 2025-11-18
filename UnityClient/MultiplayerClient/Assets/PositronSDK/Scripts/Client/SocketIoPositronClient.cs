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
        private ConnectionObjectHook _connectionObjectHook;
        private MonoBehaviourPositronCallbacksPresenter _callbacksPresenter;
        private IUdpClient _udpClient;

        private bool _connected;

        public bool IsConnected => _socket != null && _socket.Connected;
        public IIncapsulatedUdpClient UdpSubClient => _udpClient;
        public MonoBehaviourPositronCallbacksPresenter CallbacksPresenter => _callbacksPresenter;

        public event Action connected;
        public event Action disconnected;

        public SocketIoPositronClient()
        {
            _udpClient = new PositronUdpClient();
            _callbacksPresenter = new();
        }

        ~SocketIoPositronClient()
        {
            if (_connectionObjectHook != null && IsConnected)
            {
                _connectionObjectHook.hookDetouched -= OnHookDetouched;
            }
        }

        public void ConnectToMaster(ClientSettings settings)
        {
            _interactor = new();
            _connectionObjectHook = new GameObject("PositronHook").AddComponent<ConnectionObjectHook>();

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

            _connectionObjectHook.hookDetouched += OnHookDetouched;

            Debug.Log("Connecting to master ...");
        }

        public void DisconnectFromMaster()
        {
            if (IsConnected || _connected)
            {
                Debug.Log("Socket IO client disconnect");

                _socket.Disconnect();
                _socket.Dispose();
                _udpClient.Disconnect();

                _connected = false;

                disconnected?.Invoke();
            }

            _socket.Off(EventNamesHolder.CONNECTED);

            foreach (IClientMessageHandler eventHandler in _eventHandlers)
            {
                _socket.Off(eventHandler.EventName);
            }

            Debug.Log("Socket IO client evet listeners unlistened");
        }

        public void Send(string name, string content)
        {
            if (_socket.Connected)
            {
                _socket.EmitAsync(name, _interactor.CompressString(content));
            }
        }

        public void Send(string name, object content)
        {
            Send(name, JsonUtility.ToJson(content));
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
                HandleSocketEventOnMainThread(data, handler).Forget();
            });
        }

        private async UniTask HandleSocketEventOnMainThread(SocketIOResponse data, IClientMessageHandler handler)
        {
            await UniTask.SwitchToMainThread();
            handler.Process(ParseSocketIoResponse(data), _callbacksPresenter);
        }

        private void OnHookDetouched()
        {
            DisconnectFromMaster();
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
            if (_connected)
            {
                return;
            }

            InitialSocketIoMessageData response = JsonUtility.FromJson<InitialSocketIoMessageData>(ParseSocketIoResponse(data));
            await _udpClient.Connect(settings.UdpPort, response.UdpPort, settings.RemoteServerAddress);

            await UniTask.SwitchToMainThread();
            BindHandlersToSocket();

            connected?.Invoke();
            _connected = true;
        }
    }
}