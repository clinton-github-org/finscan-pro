package com.finscanpro.requestLambda.Controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Clinton Fernandes
 */
@RestController
@RequestMapping(value = "/api/v1/")
public class InputHandler {

    @GetMapping(value = "request", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String processNewRequest() {
        // Get S3 pre signed URL
        return "{\"s3Url\": \"URL\"}";
    }
}
