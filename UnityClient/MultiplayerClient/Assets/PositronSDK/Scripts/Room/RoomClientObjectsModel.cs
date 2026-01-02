using UnityEngine;
using System.Collections.Generic;
using System;

namespace Positron
{
    public sealed class RoomClientObjectsModel
    {
        private readonly Dictionary<int, PositronNetworkObject> _roomObjects = new();
        private readonly Dictionary<string, PositronNetworkObject> _cguidObjectsPool = new();

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

        public PositronNetworkObject Spawn(string resourcePath, int clientId, Vector3 position, Vector3 rotation, out string creationGuid)
        {
            GameObject prefab = Resources.Load<GameObject>(resourcePath);

            if (prefab == null)
            {
                Debug.LogError($"Critical positron error -> can`t spawn non existing in '{resourcePath}' path object !");
                creationGuid = string.Empty;
                return null;
            }

            Guid cguid = Guid.NewGuid();

            PositronNetworkObject obj = GameObject.Instantiate(prefab, position, Quaternion.Euler(rotation)).GetComponent<PositronNetworkObject>();
            obj.Init(clientId, cguid.ToString());

            _cguidObjectsPool.Add(cguid.ToString(), obj);

            creationGuid = cguid.ToString();
            return obj;
        }

        public bool TryInitByCguid(string cguid, RoomObjectData data)
        {
            if (_cguidObjectsPool.ContainsKey(cguid))
            {
                PositronNetworkObject obj = _cguidObjectsPool[cguid];
                obj.InitObjectId(data.ObjectId);
                RegisterObject(obj);

                _cguidObjectsPool.Remove(cguid);

                return true;
            }

            return false;
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

        private void RegisterObject(PositronNetworkObject obj)
        {
            if (obj == null)
            {
                Debug.LogError($"Positron error -> can`t register null object !!!");
                return;
            }

            if (_roomObjects.ContainsKey(obj.ObjectId))
            {
                Debug.LogError($"Positron error -> can`t register objt ({obj.gameObject.name}) with id '{obj.ObjectId}' twice !");
                return;
            }

            _roomObjects.Add(obj.ObjectId, obj);
        }
    }
}