namespace Positron.Editor
{
    using UnityEditor;

    [CustomEditor(typeof(PositronNetworkObject))]
    public class PositronNetworkObjectEditor : Editor
    {
        private PositronNetworkObject _object;

        private void OnEnable()
        {
            _object = (PositronNetworkObject)target;
        }

        public override void OnInspectorGUI()
        {
            if (!_object.IsFullyInitialized)
            {
                EditorGUILayout.LabelField("Object is not fully initialized !!!");
                EditorGUILayout.Space(25);
            }

            EditorGUILayout.LabelField($"Object ID: {_object.ObjectId}");
            EditorGUILayout.LabelField($"Sub object ID: {_object.SubObjectId} ({(_object.SubObjectId == -1 ? "Not SUB object" : "Is SUB object")})");
            
            EditorGUILayout.Space(15);

            EditorGUILayout.LabelField($"Owner ID: {_object.OwnerId}");

            EditorGUILayout.Space(15);

            if (PositronNetwork.Room == null || !PositronNetwork.InRoom)
            {
                EditorGUILayout.LabelField("Can`t show ownership data outside of room!");
            }
            else
            {
                EditorGUILayout.LabelField($"Is Mine: {_object.IsMine}");
                EditorGUILayout.LabelField($"Host is Owner: {_object.IsOwnedByHost} (Host ID: {PositronNetwork.Room.HostId})");
            }
        }
    }
}