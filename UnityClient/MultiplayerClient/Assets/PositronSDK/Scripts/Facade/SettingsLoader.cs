using Positron;
using UnityEngine;

public class SettingsLoader
{
    public ClientSettings Load()
    {
        return Resources.Load<ClientSettings>("ClientSettings");
    }
}