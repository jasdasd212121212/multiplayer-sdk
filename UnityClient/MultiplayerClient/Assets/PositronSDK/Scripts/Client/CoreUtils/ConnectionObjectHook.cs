using System;
using UnityEngine;

namespace Positron
{
    public class ConnectionObjectHook : MonoBehaviour
    {
        public event Action hookDetouched;

        private void Awake()
        {
            DontDestroyOnLoad(gameObject);
        }

        private void OnDestroy()
        {
            hookDetouched?.Invoke();
        }
    }
}