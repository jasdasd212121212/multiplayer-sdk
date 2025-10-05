using UnityEngine;
using System.Collections.Generic;
using System;

namespace Positron.Demo
{
    public class RoomsBrowserView : MonoBehaviour
    {
        [SerializeField] private RoomsBrowserEntryView _entryPrefab;
        [SerializeField] private Transform _listParent;

        private List<RoomsBrowserEntryView> _rooms = new();

        public event Action<string> joinClicked;

        private void OnDestroy()
        {
            ClearRoomsList();
        }

        public void DisplayRoomsList(RoomsListData data)
        {
            ClearRoomsList();

            foreach (RoomsListDataEntry dataEntry in data.Rooms)
            {
                RoomsBrowserEntryView entryView = GameObject.Instantiate(_entryPrefab, _listParent);
                entryView.Initialize(dataEntry.Guid);
                entryView.Display(dataEntry.Name, dataEntry.CurrentPlayersCount, dataEntry.MaxPlayersCount);
                entryView.joined += joinClicked;

                _rooms.Add(entryView);
            }
        }

        private void ClearRoomsList()
        {
            if (_rooms == null || _rooms.Count == 0)
            {
                return;
            }

            foreach (RoomsBrowserEntryView rooms in _rooms)
            {
                rooms.joined -= joinClicked;
                Destroy(rooms.gameObject);
            }

            _rooms.Clear();
        }
    }
}