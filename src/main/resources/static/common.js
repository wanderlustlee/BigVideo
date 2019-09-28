

// document.write("<script type='text/javascript' src='http://api.map.baidu.com/api?v=1.4'></script>");



drawCanvas();
start();

function start() {
    if (!navigator.onLine) {
        document.getElementById("main").innerHTML = "你好像没有连接到网络，请检查";
        return;
    }


    var socket = new WebsocketComponent({

            url : "ws://localhost:8080/websocket",

            displayNode : document.getElementById("message"),

            inputNode : document.getElementById("text"),

            isSendAddress : true
        }

    );

    socket.connect();

    // 事件触发之后，this就会指向window，如果想保留this的指向，可以使用变量保存this指向或者使用bind()方法改变指向
    document.getElementById("sendMessage").onclick = socket.send.bind(socket);

    console.log(document.getElementById("sendMessage"));

    // 发送图片
    var selectPicture = document.getElementById("selectPicture");
    selectPicture.onchange = function(event){
        const files = event.target.files;
        if (files != null && files.length > 0) {

            const file = files[0];
            try {

                let URL = window.URL || window.webkitURL;
                let imageURL = URL.createObjectURL(file);
                var message = {comment:imageURL,location:""};
                if(window.localStorage){
                    console.log("发送图片 支持localStorage");
                    console.log(window.localStorage.getItem("location"));
                    if (window.localStorage.getItem("location") != null) {
                        message.location = localStorage.getItem("location");
                    }
                }

                socket.websocket.send(JSON.stringify(message));


            } catch (e) {
                console.log("不支持createObjectURL");
                let fileReader = new FileReader();
                fileReader.onload = function(event) {
                    show.src = event.target.result;
                };
                fileReader.readAsDataURL(file);
            }
        }
    };


}





// canvas画图
function drawCanvas() {
    var c = document.getElementById("canvasTitle");
    var ctx = c.getContext("2d");
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'grey';
    ctx.font = '18px Arial';
    ctx.fillStyle = '#1E88C7';
    ctx.width = "10rem";
    ctx.height = "2rem";
    ctx.zIndex = "3";
    ctx.fillText('视频', 20, 40);
}






