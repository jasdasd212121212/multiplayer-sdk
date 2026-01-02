using Positron;
using UnityEngine;

public class ObjectSpawnTest : MonoBehaviour
{
    private void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Vector2 screenPos = Input.mousePosition;
            Ray ray = Camera.main.ScreenPointToRay(screenPos);

            if (Physics.Raycast(ray, out RaycastHit hit, 1000f))
            {
                PositronNetwork.SpawnObject("Test/Test", hit.point, Vector3.zero);
            }
        }

        if (Input.GetMouseButtonDown(1))
        {
            Vector2 screenPos = Input.mousePosition;
            Ray ray = Camera.main.ScreenPointToRay(screenPos);

            if (Physics.Raycast(ray, out RaycastHit hit, 1000f))
            {
                if (hit.collider.gameObject.TryGetComponent(out PositronNetworkObject obj))
                {
                    PositronNetwork.DestroyObject(obj);
                }
            }
        }
    }
}