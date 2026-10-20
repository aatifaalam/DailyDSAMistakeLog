package com.dsa.mistakelog.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaWebController {

    @GetMapping(value = {
        "/",
        "/login",
        "/register",
        "/profile",
        "/mistakes",
        "/mistakes/**",
        "/reviews",
        "/review-queue",
        "/analytics",
        "/learn",
        "/learn/**"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
