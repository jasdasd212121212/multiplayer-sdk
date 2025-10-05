using UnityEngine;

namespace Positron.Demo
{
    public class RoomsBrowserPresenter : MonoBehaviourPositronCallbacks
    {
        [SerializeField] private RoomsBrowserModel _model;
        [SerializeField] private RoomsBrowserView _view;
        [SerializeField] private RoomsCreationView _creationView;

        private void Awake()
        {
            _view.joinClicked += OnJoinClicked;
            _creationView.roomCreateButtonClicked += OnClickCreate;
        }

        private void OnDestroy()
        {
            _view.joinClicked -= OnJoinClicked;
            _creationView.roomCreateButtonClicked -= OnClickCreate;
        }

        public override void OnRoomsListReceived(RoomsListData rooms)
        {
            _view.DisplayRoomsList(rooms);
        }

        public override void OnRoomCreated(RoomCreationResponse createdRoomResponse)
        {
            _model.JoinRoom(createdRoomResponse.CreatedRoomID);
        }

        private void OnJoinClicked(string id)
        {
            _model.JoinRoom(id);
        }

        private void OnClickCreate(string name, int maxPlayersCount)
        {
            _model.CreateRoom(name, 1, maxPlayersCount);
        }
    }
}