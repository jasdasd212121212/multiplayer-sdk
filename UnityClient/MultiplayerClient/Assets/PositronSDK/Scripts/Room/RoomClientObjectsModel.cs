using UnityEngine;
using System.Collections.Generic;

namespace Positron
{
    public class RoomClientObjectsModel
    {
        private List<PositronNetworkObject> _roomObjects = new();

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
            PositronNetworkObject networkSpawned = spawned.GetComponent<PositronNetworkObject>();

            if (networkSpawned == null)
            {
                GameObject.Destroy(spawned);
                Debug.LogError($"Ciritcal error -> can`t create '{obj.PrefabAssetPath}' owner: '{obj.OwnerClientId}' id: '{obj.ObjectId}'");
                return null;    
            }

            networkSpawned.Init(obj.OwnerClientId, obj.ObjectId);

            _roomObjects.Add(networkSpawned);

            return spawned;
        }
    }
}