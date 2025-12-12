using System;

namespace Positron
{
    public interface IObservableRoomClient
    {
        int SelfId { get; }
        int HostId { get; }

        event Action roomInitialized;
        event Action roomLeft;
    }
}