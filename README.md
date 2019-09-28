# BigVideo
基于各种HTML5新特性实现的视频播放互动网页

#Websocket组件如何使用

先上个例子：

```
 var socket = new CreateWebsocket({

            url : "ws://localhost:8080/websocket",

            displayNode : document.getElementById("message"),

            inputNode : document.getElementById("text"),

            isSendAddress : true
        }

    );

    socket.connect();
```

1、使用websocket组件需要`new`一个`WebsocketComponent`对象

2、然后为这个对象传入一些自定义的属性：
```
url : 字符串，服务器的接口地址，不可为空

displayNode : DOM节点，显示服务器发送过来的数据的地方，不可为空

inputNode : DOM节点，输入信息以发送给服务器的地方，不可为空

isSendAddress : boolen，是否发送给服务器地址信息，可为空，默认为false
```

3、调用`.connect()` 方法开启连接。





#注意：
如果不用https协议,访问服务器地址为ip时，会报错。localhost访问没问题。
```
getCurrentPosition() and watchPosition() no longer work on insecure origins
```


因为上面的两个方法只能在https协议下使用，localhost不会报错是因为localhost会被认为是基于HTTP的安全来源。
