using UnityEngine;

namespace Positron.Demo
{
    public class RoomsBrowserEntryPoint : MonoBehaviour
    {
        [SerializeField] private RoomsCreationView _creationView;
        [SerializeField] private RoomsBrowserView _browserTab; 

        private RoomsBrowserModel _model;
        private RoomsBrowserPresenter _presenter;

        private void Awake()
        {
            _model = new();
            _presenter = new(_model, _browserTab, _creationView);
        }

        private void OnDestroy()
        {
            _model.Dispose();
            _presenter.Dispose();
        }
    }
}