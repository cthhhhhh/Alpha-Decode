package com.alphadecode.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/assessment")
    public String assessment() {
        return "assessment";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "dashboard";
    }

    @GetMapping("/world-map")
    public String worldMap() {
        return "world-map";
    }

    @GetMapping("/lesson")
    public String lesson() {
        return "lesson";
    }
}
