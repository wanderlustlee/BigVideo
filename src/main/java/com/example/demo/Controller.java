package com.example.demo;

import org.springframework.web.bind.annotation.RequestMapping;

@org.springframework.stereotype.Controller
public class Controller {
    @RequestMapping("/index")
    public String index(){
        return "websocketDemo";
    }

    @RequestMapping("/video")
    public String video(){
        return "videoDemo";
    }

}
