namespace Positron
{
    public static class EventNamesHolder
    {
        public static readonly string CONNECTED = "connected";
        public static readonly string ROOM_CREATED = "roomCreated";
        public static readonly string JOINED_INTO_ROOM = "joined";
        public static readonly string JOINING_FAILED = "joinFail";
        public static readonly string PLAYER_CONNECTED = "newConnection";
        public static readonly string ROOM_HOST_TRANSFER = "roomHostTransfer";
        public static readonly string ROOM_OBJECTS_TRANSFER = "roomObjectsTransfered";
        public static readonly string ROOMS_LIST = "roomsList";
        public static readonly string OBJECT_CREATED = "objectCreated";
        public static readonly string OBJECT_DELETED = "objectDeleted";
        public static readonly string RAISE_EVENT = "raiseEvent";
        public static readonly string TICK = "objectsTick";
    }
}