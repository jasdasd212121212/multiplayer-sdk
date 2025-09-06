using Cysharp.Threading.Tasks;
using UnityEngine;

namespace Positron.Demo
{
    public class DemoEntryPoint : MonoBehaviour
    {
        private void Start()
        {
            PositronNetwork.ConnectToMasterServer().Forget();
        }
    }
}