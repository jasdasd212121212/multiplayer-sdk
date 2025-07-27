# multiplayer-sdk

### Server API

## Creater room
request: CreateRoom
```
{
    "name": "any name",
    "scene": -1,
    "data": {
        "any_key": "any values etc."
    }
}
```

response: roomCreated
```
{
    "createdRoomId": "DATE UUID"
}
```
 
 
 
## Join room
reques: JoinRoom
```
{
    "id": "DATE UUID"
}
```

response: joined
```
{
    "clientId": -1,
    "hostId": -1,
    "scene": -1,
    "objects": {
        o: [
            {
                "a": "asset path",
                "i": -1,
                "c": -1,
                "p":{
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "r":{
                    "x": 0,
                    "y": 0,
                    "z": 0
                }
            },
            {
                "a": "asset path",
                "i": -1,
                "c": -1,
                "p":{
                    "x": 0,
                    "y": 0,
                    "z": 0
                },
                "r":{
                    "x": 0,
                    "y": 0,
                    "z": 0
                }
            }
        ]
    }
}
```
OR Socket io event: 'joinFail' with empty body

Response for others: newConnection
```
EMPTY
```


## Disconnect while in room (Or leave)
request: disconnect
```
EMPTY
```

response: standart disconnect
```
EMPTY
```

response for others:

event: roomHostTransfer
```
{
    "targetId": -1
}
```

event: roomObjectsTransfered
```
{
    "tarnsferedToClient": -1,
    "objects": [-1,-2,-3]
}
```



## Get rooms
request: GetRooms
```
EMPTY
```
response: roomsList
```
{
    "list":[
        {
            "name": "any name",
            "guid": "DATE UUID",
            "data": {
                "any_key": "any values etc."
            }
        },
        {
            "name": "any name 2",
            "guid": "DATE UUID 2",
            "data": {
                "any_key": "any values etc. 2"
            }
        }
    ]
}
```




## Change scene
request: ChangeScene
```
{
    "newSceneIndex": -1
}
```

response: roomSceneChanged
```
{
    "newSceneIndexOfRoom": -1
}
```



## Create object
request: CreateObject
```
{
    "asset": "asset path",
    "cguid": "unity GUID",

    "position":{
        "x": 0,
        "y": 0,
        "z": 0
    },

    "rotation":{
        "x": 0,
        "y": 0,
        "z": 0
    }
}
```

response: objectCreated
```
{
    "cguid": "unity guid",
    "data":{
        "a": "asset path",
        "i": -1,
        "c": -1,
        "p":{
            "x": 0,
            "y": 0,
            "z": 0
        },
        "r":{
            "x": 0,
            "y": 0,
            "z": 0
        }
    }
}
```

## Update objects
request: UpgradeObjects
```
{
    "clientId": 1,
     
    "o": [
        {
            "i": 0,
            "p": {"x": 1, "y": 2, "z": 3},
            "r": {"x": 1, "y": 2, "z": 3}
        },
        {
            "i": 1,
            "p": {"x": 1, "y": 2, "z": 3},
            "r": {"x": 1, "y": 2, "z": 3}
        }
    ]
}
```
response: NONE
```
EMPTY
```

## Remove object
request: DeleteObject
```
{
    "id": 0, 
    "client": 1
}
```
response: objectDeleted
```
{
    "id": 0
}
```

## Raise event
request: RaiseEvent
```
{
    "type": 0,
    "targets": 3,
    "sourceObjectId": 0,
    "additionalIndex": 0,
    "targetClient": -1,
    
    "payload": {
        "message": "hello"
    }
}
```

response: raiseEvent
```
{
    "type": 0,
    "targets": 3,
    "sourceObjectId": 0,
    "additionalIndex": 0,
    "targetClient": -1,
    
    "payload": {
        "message": "hello"
    }
}
```

## On Tick
response: objectsTick
```
{
    "o": [
        {
            "i": 0,
            "p": {"x": 1, "y": 2, "z": 3},
            "r": {"x": 1, "y": 2, "z": 3}
        }
    ]
}
```
Note: server respond ONLY update object in comparison to previous netframe