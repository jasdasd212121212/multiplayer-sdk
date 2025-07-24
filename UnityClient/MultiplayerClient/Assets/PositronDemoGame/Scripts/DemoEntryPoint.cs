using UnityEngine;

namespace Positron.Demo
{
    public class DemoEntryPoint : MonoBehaviour
    {
        private void Start()
        {
            PositronNetwork.ConnectToMasterServer(() =>
            {
                Debug.Log("Connected to master!!!");
                PositronNetwork.FetchRoomsList();
            });
        }
    }
}