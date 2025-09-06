using System;
using UnityEngine;

namespace Positron
{
    public class MonoBehaviourPositronCallbacksPresenter
    {
        private MonoBehaviourPositronCallbacks[] _views;

        public void RefrashViews()
        {
            _views = GameObject.FindObjectsByType<MonoBehaviourPositronCallbacks>(FindObjectsSortMode.None);
        }

        public void ForEachView(Action<MonoBehaviourPositronCallbacks> process)
        {
            if (_views == null || _views.Length == 0)
            {
                RefrashViews();
            }

            foreach (MonoBehaviourPositronCallbacks view in _views)
            {
                process(view);
            }
        }
    }
}