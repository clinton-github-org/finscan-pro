package com.finscanpro.requestLambda.controller;

import com.finscanpro.requestLambda.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * @author Clinton Fernandes
 */
@RestController
@RequestMapping(value = "/api")
public class InputController {

    @Autowired
    private S3Service s3Service;

    @PostMapping(value = "/request", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> processNewRequest(@RequestBody String fileName) {
        Map<String, Object> body = new HashMap<>();
        Map<String, String> metadata = new HashMap<>();
        UUID uuid = UUID.randomUUID();

        metadata.put("File name", fileName);
        String keyName = uuid.toString().concat("/").concat(fileName);
        s3Service.putS3Object(keyName);
        String url = s3Service.getS3PreSignedUrl(keyName, metadata, "application/pdf");
        body.put("s3URL", url);
        body.put("folderName", uuid);

        return new ResponseEntity<>(body, HttpStatus.OK);
    }
}
