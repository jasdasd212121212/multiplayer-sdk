using System;
using UnityEngine;

namespace Positron
{
    public class ConnectionObjectKernel : MonoBehaviour
    {
        public event Action kernelDestroyed;

        private void Awake()
        {
            DontDestroyOnLoad(gameObject);
        }

        private void OnDestroy()
        {
            kernelDestroyed?.Invoke();
        }
    }
}