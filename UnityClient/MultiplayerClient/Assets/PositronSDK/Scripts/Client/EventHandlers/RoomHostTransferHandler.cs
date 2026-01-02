using System;
using UnityEngine;

namespace Positron
{
    public class RoomHostTransferHandler : IClientMessageHandler
    {
        public string EventName => "roomHostTransfer";

        public event Action<int> hostTransfered;

        public void Process(string data, PositronCallbacksPresenter presenter)
        {
            HostTransferResponse response = JsonUtility.FromJson<HostTransferResponse>(data);
            hostTransfered?.Invoke(response.NewHostId);

            presenter.ForEachView((IPositronCallbackable view) =>
            {
                view.HostTransfered();
            });
        }
    }
}