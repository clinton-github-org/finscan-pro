package com.finscanpro.requestLambda.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    public ResponseEntity<Object> processNewRequest(@RequestBody String requestBody) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode requestJson = mapper.readTree(requestBody);
        String fileName = requestJson.get("fileName").textValue();
        Map<String, Object> body = new HashMap<>();
        UUID uuid = UUID.randomUUID();

        String keyName = uuid.toString().concat("/").concat(fileName);
        s3Service.putS3Object(keyName);
        String url = s3Service.getS3PreSignedUrl(keyName);
        body.put("s3URL", url);
        body.put("folderName", uuid);

        return new ResponseEntity<>(body, HttpStatus.OK);
    }
}
