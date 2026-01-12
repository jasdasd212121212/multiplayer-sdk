using System;
using UnityEngine;

namespace Positron
{
    [Serializable]
    public class RemoveObjectResponse
    {
        [SerializeField] private int id;

        public int ObjectId => id;
    }
}