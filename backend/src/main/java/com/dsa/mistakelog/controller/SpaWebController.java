package com.dsa.mistakelog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaWebController {

    @GetMapping(value = {
        "/",
        "/mistakes",
        "/mistakes/{id:[0-9]+}",
        "/mistakes/{id:[0-9]+}/edit",
        "/mistakes/new",
        "/analytics"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
