namespace Positron
{
    public static class RequestEventNamesHolder
    {
        public static readonly string CREATE_ROOM = "CreateRoom";
        public static readonly string JOIN_ROOM = "JoinRoom";
        public static readonly string LEAVE_ROOM = "LeaveRoom";
        public static readonly string GET_ROOMS_LIST = "GetRooms";
        public static readonly string ROOM_OBJECTS_MODIFICATION = "CreateOrDeleteObjects";
        public static readonly string RAISE_EVENT = "RaiseEvent";
    }
}