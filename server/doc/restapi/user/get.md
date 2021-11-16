# 회원 정보 가져오기

회원의 정보를 하나만 가져옵니다.

**Method** : `GET`

**URL** : `/api/user`

## Query
* 쿼리는 `{속성}:{값}`으로 검색됩니다.
```javascript
// id 속성으로 검색
/api/user?id=np1
// name 속성으로 검색
/api/user?name=김정민
...
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "code": "ok",
    "result": {
        "_id": "5d8f732695a8bd2bcc661cad",
        "consult_c": 0,
        "visit_c": 0,
        "count_arr": [
            {
                "tc": 5,
                "c": 0
            }
        ],
        "create_t": "2019-09-28T14:49:50.225Z",
        "id": "np2",
        "name": "김남욱",
        "sex": "man",
        "birth": "19870401",
        "phone": "01011112222",
        "email": "np1@test.com",
        "address": "부천시",
        "job": "PM",
        "cach_r": false,
        "info": {
            "sms": false,
            "email": true,
            "msg": false
        },
        "member": 0,
        "etc": "헬스맨.",
        "point": 0,
        "__v": 0
    }
}

or 

null
```

## Notes
* 쿼리에 해당하는 하나의 도큐먼트를 가져옵니다.