using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class RoomCreationRequestData
    {
        [SerializeField] private string name;
        [SerializeField] private int scene;
        [SerializeField] private int maxPlayers;
        [SerializeField] private object data;

        public string Name => name;
        public int Scene => scene;
        public int MaxPlayers => maxPlayers;
        public object Data => data;

        public RoomCreationRequestData(string name, int scene, int maxPlayers, object data)
        {
            this.name = name;
            this.scene = scene;
            this.maxPlayers = maxPlayers;
            this.data = data;
        }
    }
}