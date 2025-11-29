using Cysharp.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using UnityEngine;

namespace Positron
{
    public class PositronUdpClient : IUdpClient
    {
        private UdpClient _client;
        private BrotlitInteractor _brotlit;

        private List<IUdpClientMessageHandler> _messageHandlers = new();

        private string _host;
        private int _hostPort;
        private string _uuid;

        public PositronUdpClient()
        {
            _brotlit = new BrotlitInteractor();
        }

        public async UniTask Connect(int hostPort, string uuid, string host)
        {
            await UniTask.SwitchToMainThread();

            _host = host;
            _hostPort = hostPort;
            _uuid = uuid;

            int port = Random.Range(40000, 60000);
            _client = new(port);

            await ConnectAsync(uuid);

            Debug.Log($"UDP connected succesfully. Host: {host} Host port: {hostPort} Self (local client) port: {port} UUID: {uuid}");
        }

        public void Disconnect()
        {
            if (_client != null)
            {
                Debug.Log("Udp client disconnect");

                _client.Close();
                _client.Dispose();

                _client = null;
            }
        }

        public void Send(byte code, string message)
        {
            byte[] coddedPreffix = GetCodeAndUuidPreffix(code, _uuid);
            SendAsync(coddedPreffix.Concat(Encoding.UTF8.GetBytes(_brotlit.CompressString(message))).ToArray()).Forget();
        }

        public void AddHandler(IUdpClientMessageHandler handler)
        {
            _messageHandlers.Add(handler);
        }

        public T GetHandler<T>() where T : IUdpClientMessageHandler
        {
            return (T)_messageHandlers.Where(handler => handler.GetType() == typeof(T)).First();
        }

        private async UniTask ConnectAsync(string uuid)
        {
            bool connected = false;

            while (!connected)
            {
                byte[] setConnectionMessage = GetCodeAndUuidPreffix(UdpEventsHolder.SET_CONNECTION, uuid);

                await _client.SendAsync(setConnectionMessage, setConnectionMessage.Length, _host, _hostPort);

                await UniTask.Delay(500);

                UdpReceiveResult result = await _client.ReceiveAsync();
                string message = Encoding.UTF8.GetString(result.Buffer).Trim();

                if(message == UdpEventsHolder.CONNECTION_RESPONSE)
                {
                    connected = true;
                }
            }

            ReceiveLoop().Forget();
        }

        private async UniTask ReceiveLoop()
        {
            while (_client != null)
            {
                try
                {
                    UdpReceiveResult result = await _client.ReceiveAsync();
                    SplitBuffer(result.Buffer, 1, out byte[] code, out byte[] message);

                    string receivedString = _brotlit.DecompressString(Encoding.UTF8.GetString(message).Trim());
                    Debug.Log(receivedString);

                    for (int i = 0; i < _messageHandlers.Count; i++)
                    {
                        if (_messageHandlers[i].Code == code[0])
                        {
                            _messageHandlers[i].Handle(receivedString);
                        }
                    }
                }
                catch { }
            }
        }

        private async UniTask SendAsync(byte[] message)
        {
            try
            {
                await _client.SendAsync(message, message.Length, _host, _hostPort);
            }
            catch { }
        }

        private void SplitBuffer<T>(T[] array, int index, out T[] first, out T[] second)
        {
            first = array.Take(index).ToArray();
            second = array.Skip(index).ToArray();
        }

        private byte[] GetCodeAndUuidPreffix(byte code, string uuid)
        {
            byte[] codded = new byte[37];
            byte[] coddedUuid = Encoding.UTF8.GetBytes(uuid);
            codded[0] = code;

            for (int i = 0; i < coddedUuid.Length; i++)
            {
                codded[i + 1] = coddedUuid[i];
            }

            return codded;
        }
    }
}