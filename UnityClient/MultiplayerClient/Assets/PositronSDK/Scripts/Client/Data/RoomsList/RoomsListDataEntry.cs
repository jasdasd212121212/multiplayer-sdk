using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class RoomsListDataEntry
    {
        [SerializeField] private string name;
        [SerializeField] private string guid;
        [SerializeField] private object data;
        [SerializeField] private int count;
        [SerializeField] private int max;

        public string Name => name;
        public string Guid => guid;
        public object Data => data;
        public int CurrentPlayersCount => count;
        public int MaxPlayersCount => max;
    }
}