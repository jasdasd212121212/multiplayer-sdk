using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace Positron.Demo
{
    public class RoomsBrowserEntryView : MonoBehaviour
    {
        [SerializeField] private TextMeshProUGUI _roomName;
        [SerializeField] private TextMeshProUGUI _roomPlayersCount;
        [SerializeField] private Button _joinButton;

        private string _id;
        private bool _initialized;

        public event Action<string> joined;

        public void Initialize(string id)
        {
            if (_initialized)
            {
                return;
            }

            _id = id;
            _joinButton.onClick.AddListener(OnClickJoin);

            _initialized = true;
        }

        public void Display(string name, int currentPlayersCount, int maxPlayersCount)
        {
            _roomName.text = name;
            _roomPlayersCount.text = $"{currentPlayersCount}/{maxPlayersCount}";
        }

        private void OnDestroy()
        {
            _joinButton.onClick.RemoveListener(OnClickJoin);
        }

        private void OnClickJoin()
        {
            joined?.Invoke(_id);
        }
    }
}