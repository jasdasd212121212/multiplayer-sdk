namespace Positron.Demo
{
    public class RoomsBrowserPresenter : PositronCallbacks
    {
        private readonly RoomsBrowserModel _model;
        private readonly RoomsBrowserView _view;
        private readonly RoomsCreationView _creationView;

        public RoomsBrowserPresenter(RoomsBrowserModel model, RoomsBrowserView view, RoomsCreationView creationView) : base()
        {
            _model = model;
            _view = view;
            _creationView = creationView;

            _view.joinClicked += OnJoinClicked;
            _creationView.roomCreateButtonClicked += OnClickCreate;
        }

        protected override void OnDisposed()
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