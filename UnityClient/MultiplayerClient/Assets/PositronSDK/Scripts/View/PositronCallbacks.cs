using System;
using UnityEngine;

namespace Positron
{
    public abstract class PositronCallbacks : IPositronCallbackable, IDisposable
    {
        private bool _disposed;

        public PositronCallbacks()
        {
            PositronNetwork.AddPositronView(this);
            OnInit();
        }

        ~PositronCallbacks()
        {
            if (!_disposed)
            {
                Debug.LogError($"Critical error -> positron callbacks class are not disposed while destroying by GC");
            }

            Dispose();
        }

        public void Dispose()
        {
            _disposed = true;
            PositronNetwork.RemovePositronView(this);
            OnDisposed();
        }

        protected virtual void OnInit() { }
        protected virtual void OnDisposed() { }

        public virtual void OnRoomsListReceived(RoomsListData rooms) { }
        public virtual void OnConnectedToMaster() { }
        public virtual void OnRoomCreated(RoomCreationResponse createdRoomResponse) { }
        public virtual void OnRoomJoined(RoomJoinResponse room) { }
        public virtual void HostTransfered() { }
    }
}