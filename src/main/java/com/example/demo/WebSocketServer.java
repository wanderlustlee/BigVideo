package com.example.demo;

import org.springframework.boot.json.JsonParser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import javax.websocket.*;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;


/**
 * @ServerEndpoint 用于配置websocket的地址    ws：//127.0.0.1:8080/websocket
 */
@ServerEndpoint(value = "/websocket")
@Component
public class WebSocketServer {
    //TODO 这里根据实际业务进行代码的书写

    //concurrent包的线程安全Set，每个客户端的websocket连接会创建一个WebSocketServer对象。
    private static CopyOnWriteArraySet<WebSocketServer> webSocketSet = new CopyOnWriteArraySet<>();

    //这个session是每个websocket与某个客户端的连接会话，通过它与客户端进行数据交互。
    private Session session;

    /**
     * websocket连接建立成功调用的方法
     */
    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
        webSocketSet.add(this);     //加入set中
        System.out.println("有新连接加入！sessionID为：" + session.getId());
        try {
            sendMessage("恭喜 连接websocket服务端成功");
        } catch (IOException e) {
            System.out.println("IO异常");
        }
    }

    /**
     * 关闭websocket连接调用的方法
     */
    @OnClose
    public void onClose() {
        webSocketSet.remove(this);  //从set中删除
        System.out.println("有一连接关闭！sessionID为：" + session.getId());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息
     */
    @OnMessage
    public void onMessage(String message) {
        System.out.println("来自客户端的消息:" + message);
        //将接受到的消息群发给所有websocket连接。这里也可以根据实际需求修改代码，将接受到的信息发送给某个指定的websocket连接。
        for (WebSocketServer item : webSocketSet) {
            try {
                JSONObject object = JSONObject.parseObject(message);
                String location = object.get("location").toString();
                String comment = object.get("comment").toString();
                String response = StringUtils.isEmpty(location) ? "小v：" + comment : location + "的小v：" + comment;
                item.sendMessage(response);
            } catch (Exception e) {
                try {
                    item.sendMessage(message);
                    System.out.println("发送了图片");
                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            }
        }
    }

    /**
     * 发生错误时调用
     */
    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println("发生错误");
        error.printStackTrace();
    }

    public void sendMessage(String message) throws IOException {
        this.session.getBasicRemote().sendText(message);  //这两个方法是同步和异步的关系
        //this.session.getAsyncRemote().sendText(message);
    }


}

