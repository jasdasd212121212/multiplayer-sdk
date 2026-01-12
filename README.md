# multiplayer-sdk

### Server API

## Connect
request: standart socket.io connection

resonse: connected
```
{
    "udp": -1
}
```
udp: UDP port from 40000 to 60000

## Creater room
request: CreateRoom
```
{
    "name": "any name",
    "scene": -1,
    "maxPlayers": 1,
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
    },
    "events": [
        {
            "type": -1,
            "targets": -1,
            "sourceObjectId": -1,
            "additionalIndex": -1,
            "targetClient": -1,
            "payload": {
                "message": "hello"
            }
        }
    ],
    "variables":[
        {
            "id": "objectid#subid#selfid",
            "data": {
                "value": "any value"
            }
        }
    ],
    "tickrate": 20
}
```
OR Socket io event: 'joinFail' with empty body

Response for others: newConnection
```
EMPTY
```


## Disconnect while in room (Or leave)
request: disconnect or LeaveRoom
```
EMPTY
```

response: disconnect or roomLeaved
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
    "rooms":[
        {
            "name": "any name",
            "guid": "DATE UUID",
            "data": {
                "any_key": "any values etc."
            },
            "count": -1,
            "max": -1
        },
        {
            "name": "any name 2",
            "guid": "DATE UUID 2",
            "data": {
                "any_key": "any values etc. 2"
            },
            "count": -1,
            "max": -1
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

## Modify or add network variables

request: ModifyVars
```
{
    "variables":[
        {
            "id": "objectid#subid#selfid",
            "data": {
                "value": "any value"
            }
        },
        {
            "id": "objectid#subid#selfid",
            "data": {
                "value": "any value"
            }
        }
    ]
}
```

response: netVarsChanged
```
{
    "modified": [
        {
            "id": "objectid#subid#selfid",
            "data": {
                "value": "any value"
            }
        },
        {
            "id": "objectid#subid#selfid",
            "data": {
                "value": "any value"
            }
        }
    ],
    "adden": [
        {
            "id": "objectid#subid#selfid",
            "data": {
                "value": "any value"
            }
        },
        {
            "id": "objectid#subid#selfid",
            "data": {
                "value": "any value"
            }
        }
    ]
}
```

## Remove network variables
request: RemoveVarsFromObject
```
{
    "objectId": -1
}
```

response: netVarsRemoval
```
{
    "deletedVaraiblesIDs": [
        "id1",
        "id2",
        "id3"
    ]
}
```

## Create or delte object batched
request: CreateOrDeleteObjects
```
{
    "creation": [
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
    ],
    "deletion": [
        {
            "id": 0, 
            "client": 1
        }
    ]
}
```

response: objectActBatched
```
{
    "created": [
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
    ],
    "deleted": [
        {
            "id": 0
        }
    ]
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



# UDP events
## Update objects
code: 1
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
code: NONE
```
EMPTY
```


## On Tick
code: 2
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
Note: server respond ONLY updated objects in comparison to previous netframe

# UDP connection features
This udp sub server requires confirmation of UDP connection. Client sends packeges with datagrams (array of bytes) 
```
[0]
```
Server responds:
```
connected
```

If all succesfully connection are confirmed and ready to work.

All UDP connections bind port to given UDP port from main Socket.io server (In range 40000 to 60000)


# About Brotlit server side compression
Because unity socket io client does not work with perMessageDeflate i decided to integrate Brot;it compression.

#### Case if message <256 bytes
```
NCNC;;; <any JSON here>
```

#### If message >256 bytes
```
All message will compressed with brotlit
```