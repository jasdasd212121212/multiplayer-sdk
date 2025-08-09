namespace Positron
{
    public interface IUdpClientMessageHandler
    {
        byte Code { get; }
        void Handle(string message);
    }
}