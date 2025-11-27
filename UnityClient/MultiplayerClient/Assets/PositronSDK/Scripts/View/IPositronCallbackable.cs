namespace Positron
{
    public interface IPositronCallbackable
    {
        void OnRoomsListReceived(RoomsListData rooms);
        void OnConnectedToMaster();
        void OnRoomCreated(RoomCreationResponse createdRoomResponse);
        void OnRoomJoined(RoomJoinResponse room);
    }
}