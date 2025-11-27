using UnityEngine;
using System;

namespace Positron
{
    [Serializable]
    public class RoomJoinResponse
    {
        [SerializeField] private int clientId;
        [SerializeField] private int hostId;
        [SerializeField] private int sceneIndex;
        [SerializeField] private RoomJoinObjectsWrapPackege objects;
        [SerializeField] private RaiseEventData[] events;
        [SerializeField] private NetVariableData[] variables;
        [SerializeField] private int tickrate;

        public int SelfId => clientId;
        public int HostId => hostId;
        public int SceneIndex => sceneIndex;
        public RoomObjectData[] Objects => objects.SceneObjectsFullSynced;
        public RaiseEventData[] Events => events;
        public NetVariableData[] Variables => variables;
        public int Tickrate => tickrate;
    }
}