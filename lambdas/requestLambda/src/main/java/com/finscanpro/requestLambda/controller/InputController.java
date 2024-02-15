package com.finscanpro.requestLambda.controller;

import com.finscanpro.requestLambda.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * @author Clinton Fernandes
 */
@RestController
@RequestMapping(value = "/api/v1/")
public class InputController {

    @Autowired
    private S3Service s3Service;

    @GetMapping(value = "request", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> processNewRequest(@RequestParam String fileName) {
        Map<String, Object> body = new HashMap<>();
        Map<String, String> metadata = new HashMap<>();
        UUID uuid = UUID.randomUUID();

        metadata.put("File name", fileName);
        String url = s3Service.getS3PreSignedUrl(uuid + "/" + fileName, metadata);
        body.put("s3URL", url);
        return ResponseEntity.ok(body);
    }
}
