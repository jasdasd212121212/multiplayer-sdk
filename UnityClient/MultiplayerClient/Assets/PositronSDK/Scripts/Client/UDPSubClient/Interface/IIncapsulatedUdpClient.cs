namespace Positron
{
    public interface IIncapsulatedUdpClient
    {
        void Send(byte code, string message);
        T GetHandler<T>() where T : IUdpClientMessageHandler;
    }
}