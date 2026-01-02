using UnityEngine;
using System.Collections.Generic;

namespace Positron
{
    public sealed class RoomClientObjectsModel
    {
        private readonly Dictionary<int, PositronNetworkObject> _roomObjects = new();

        public void SpawnMany(RoomObjectData[] objects)
        {
            foreach (RoomObjectData obj in objects)
            {
                Spawn(obj);
            }
        }

        public GameObject Spawn(RoomObjectData obj)
        {
            GameObject prefab = Resources.Load<GameObject>(obj.PrefabAssetPath);

            if (prefab == null)
            {
                Debug.LogError($"Critical positron error -> can`t spawn non existing in '{obj.PrefabAssetPath}' path object !");
                return null;
            }

            GameObject spawned = GameObject.Instantiate(prefab, obj.Position, Quaternion.Euler(obj.Rotation));
            
            if (!spawned.TryGetComponent<PositronNetworkObject>(out PositronNetworkObject networkSpawned))
            {
                GameObject.Destroy(spawned);
                Debug.LogError($"Ciritcal error -> can`t create '{obj.PrefabAssetPath}' owner: '{obj.OwnerClientId}' id: '{obj.ObjectId}'");
                return null;    
            }

            networkSpawned.Init(obj.OwnerClientId, obj.ObjectId);
            _roomObjects.Add(networkSpawned.ObjectId, networkSpawned);

            return spawned;
        }

        public PositronNetworkObject FindObjectById(int id)
        {
            if (_roomObjects.ContainsKey(id))
            {
                return _roomObjects[id];
            }

            Debug.LogError($"Positron error -> unable to find object with ID: {id}");
            return null;
        }

        public void DestroyObject(PositronNetworkObject obj)
        {
            if (!_roomObjects.ContainsKey(obj.ObjectId))
            {
                Debug.LogError($"Positron error -> can`t destroy non-existing object");
                return;
            }

            _roomObjects.Remove(obj.ObjectId);
            GameObject.Destroy(obj.gameObject);
        }

        public bool ContainsObjectById(int id) => _roomObjects.ContainsKey(id);
    }
}