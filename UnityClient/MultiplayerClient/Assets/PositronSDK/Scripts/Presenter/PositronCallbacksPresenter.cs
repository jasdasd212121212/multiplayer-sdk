using System;
using UnityEngine;
using System.Collections.Generic;
using System.Linq;

namespace Positron
{
    public class PositronCallbacksPresenter
    {
        private List<IPositronCallbackable> _views = new();

        public void RefrashViews()
        {
            List<IPositronCallbackable> views = GameObject.FindObjectsByType<MonoBehaviourPositronCallbacks>(FindObjectsSortMode.None).
                Select(view => view as IPositronCallbackable).
                ToList();

            if (views == null || views.Count == 0)
            {
                return;
            }

            foreach (IPositronCallbackable view in views)
            {
                AddView(view);
            }
        }

        public void AddView(IPositronCallbackable view)
        {
            if (_views.Contains(view))
            {
                return;
            }

            _views.Add(view);
        }

        public void RemoveView(IPositronCallbackable view)
        {
            if (!_views.Contains(view))
            {
                return;
            }

            _views.Remove(view);
        }

        public void ForEachView(Action<IPositronCallbackable> process)
        {
            if (_views == null || _views.Count == 0)
            {
                RefrashViews();
            }

            foreach (IPositronCallbackable view in _views)
            {
                process(view);
            }
        }
    }
}