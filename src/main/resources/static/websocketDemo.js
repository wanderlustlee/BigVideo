// var script=document.createElement("script");
//
// script.setAttribute("type", "text/javascript");
//
// script.setAttribute("src", "http://api.map.baidu.com/api?v=1.4");
//
// var body = document.getElementsByTagName("body");
//
// if(body.length) {
//     body[0].appendChild(script);
// } else {
//     document.documentElement.appendChild(script);
// }

document.open();
document.write("<script type='text/javascript' src='http://api.map.baidu.com/api?v=1.4'></script>");
document.close();


function WebsocketComponent(socket) {

    this.url = socket.url;
    this.displayNode = socket.displayNode;
    this.inputNode = socket.inputNode;
    this.isSendAddress = socket.isSendAddress === undefined ? false : socket.isSendAddress;
    this.websocket;
}

WebsocketComponent.prototype = {
    constructor: WebsocketComponent,

    //这一步就是向后台建立连接    协议开头不是HTTP 而是ws或者wss
    connect: function () {
        this.websocket = new WebSocket(this.url);
        console.log("this.url:"+this.url);
        //连接发生错误的回调方法
        this.websocket.onerror = function () {

            setMessageInnerHTML("error",this.displayNode);
        };

        //连接成功建立的回调方法
        var that = this;
        this.websocket.onopen = function (event) {
            setMessageInnerHTML("开启连接",that.displayNode);
            // 定时删除弹幕dom
            setInterval(()=>{
                console.log("定时删除弹幕dom  开始执行")
                let danmuList = [...document.getElementsByClassName("danmu")];
                danmuList.forEach(div => {
                    let offsetLeft = div.offsetLeft;
                    let parentWidth = Math.round(parseFloat(window.getComputedStyle(div.parentElement,null).width));
                    if (offsetLeft === parentWidth) {
                        console.log("播放完了");
                        let parent = div.parentElement;
                        parent.removeChild(div);
                    }
                });

            },10000);

        };

        //接收到消息的回调方法
        this.websocket.onmessage = function (event) {
            setMessageInnerHTML(event.data,that.displayNode);
        };

        //连接关闭的回调方法
        this.websocket.onclose = function () {
            setMessageInnerHTML("关闭连接",that.displayNode);
        };
    },

    send: function () {

        var comment = document.getElementById('text').value;
        var message = {comment: comment, location: ""};


        if (!navigator.geolocation) {
            output.innerHTML = "<p>您的浏览器不支持地理位置</p>";
            return;
        }
        var that = this;

        function success(position) {
            console.log("!!!!!!  isSendAddress: "+that.isSendAddress);
            if (!that.isSendAddress) {
                if (that.websocket.readyState === 1) {
                    that.websocket.send(JSON.stringify(message));
                    that.inputNode.value = "";
                    return;
                }

            }

            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            getAddress(longitude, latitude).then(result => {
                message.location = result;
                if (window.localStorage) {
                    window.localStorage.setItem("location", result);
                }
                that.websocket.send(JSON.stringify(message));
                that.inputNode.value = "";
            });
        }

        function error(e) {
            that.websocket.send(JSON.stringify(message));
            console.log("无法获取您的位置"+e);
        }

        navigator.geolocation.getCurrentPosition(success, error);


    },

    closeWebSocket: function () {
        this.websocket.close();
    },





};



function setMessageInnerHTML(innerHTML,displayNode) {
    console.log("_------ "+displayNode.id);
    if (innerHTML.toString().includes("blob:")) {
        let imgUrlIndex = innerHTML.toString().search("blob:");
        let imgUrl = innerHTML.toString().slice(imgUrlIndex);
        var img = document.createElement("img");
        img.src = imgUrl;
        displayNode.innerHTML += innerHTML.toString().slice(0, imgUrlIndex);
        displayNode.appendChild(img);
        displayNode.innerHTML += '<br/>';
    } else {

        if (typeof (Worker) !== "undefined") {
            var worker;
            if (typeof (worker) == "undefined") {
                worker = new Worker("webworker.js");
            }
            worker.onmessage = function (event) {
                console.log("收到webworker信息");
                var color = event.data;
                innerHTML = "<span style='color:" + color + "'>" + innerHTML + "</span>";
                displayNode.innerHTML += innerHTML + '<br/>';
                displayDanmu(innerHTML);

            };
        } else {
            document.getElementById("result").innerHTML = "抱歉，你的浏览器不支持 Web Workers...";
            displayNode.innerHTML += innerHTML + '<br/>';
        }
    }

    displayNode.scrollTop = displayNode.scrollHeight*2;
    console.log("滑到最下面");
}

function displayDanmu(innerHTML) {
    const videoDiv = document.getElementById("content-video");
    const childNode = document.createElement('div');
    childNode.className = "danmu";
    childNode.style.top = Math.floor((Math.random() * 95)).toString() + "%";
    childNode.style.textShadow = "2px 2px 4px #000000";
    childNode.innerHTML = innerHTML;
    videoDiv.appendChild(childNode);

}

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
// window.onbeforeunload = function () {
//     this.websocket.close();
// };


function getAddress(longitude, latitude) {
    //通过baiduMap API获取街道名称
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(longitude, latitude);
    var gc = new BMap.Geocoder();

    return new Promise((resolve, reject) => {
        gc.getLocation(point, function(result) {
            resolve(result.addressComponents.province+result.addressComponents.city);
        });
    });
}



