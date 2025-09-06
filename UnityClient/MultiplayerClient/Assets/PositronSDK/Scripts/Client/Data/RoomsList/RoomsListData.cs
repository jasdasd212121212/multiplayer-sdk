using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class RoomsListData
    {
        [SerializeField] private RoomsListDataEntry[] rooms;

        public RoomsListDataEntry[] Rooms => rooms;
    }
}