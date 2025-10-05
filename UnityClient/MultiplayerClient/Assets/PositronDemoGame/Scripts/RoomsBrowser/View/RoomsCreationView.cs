using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class RoomsCreationView : MonoBehaviour
{
    [SerializeField] private TMP_InputField _nameField;
    [SerializeField] private TMP_InputField _playersCountField;
    [SerializeField] private Button _createButton;

    public event Action<string, int> roomCreateButtonClicked;  

    private void Awake()
    {
        _createButton.onClick.AddListener(OnClickCreateButton);
    }

    private void OnDestroy()
    {
        _createButton.onClick.RemoveListener(OnClickCreateButton);
    }

    private void OnClickCreateButton()
    {
        roomCreateButtonClicked?.Invoke(_nameField.text, int.Parse(_playersCountField.text));
    }
}