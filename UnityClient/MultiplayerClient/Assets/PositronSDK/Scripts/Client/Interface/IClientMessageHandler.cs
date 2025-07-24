namespace Positron
{
    public interface IClientMessageHandler
    {
        string EventName { get; }
        void Process(string data);
    }
}