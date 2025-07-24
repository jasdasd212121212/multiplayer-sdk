using UnityEngine;

namespace Positron
{
    public class PositronEntryPoint
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        public static void OnInit()
        {
            PositronNetwork.Initialize(new SocketIoPositronClient());
        }
    }
}