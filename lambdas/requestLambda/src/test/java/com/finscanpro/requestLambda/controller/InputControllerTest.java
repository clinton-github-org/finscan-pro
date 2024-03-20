package com.finscanpro.requestLambda.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.finscanpro.requestLambda.service.S3Service;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

/**
 * @author Clinton Fernandes
 */
@ExtendWith(MockitoExtension.class)
public class InputControllerTest {

    @Mock
    private S3Service s3Service = new S3Service("10", "TestBucket");
    @InjectMocks
    private InputController inputController;

    @SuppressWarnings("unchecked")
    @Test
    public void testProcessNewRequest() throws JsonProcessingException {
        String requestBody = "{\"fileName\":\"dummy.pdf\", \"contentType\": \"application/pdf\"}";
        String expectedUrl = "http://example.com/presigned-url";

        when(s3Service.getS3PreSignedUrl(anyString(), anyMap(), anyString())).thenReturn(expectedUrl);
        doNothing().when(s3Service).putS3Object(anyString());

        ResponseEntity<Object> response = inputController.processNewRequest(requestBody);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(expectedUrl, ((Map<String, Object>) Objects.requireNonNull(response.getBody())).get("s3URL"));
        assertNotNull(((Map<String, Object>) Objects.requireNonNull(response.getBody())).get("folderName"));
    }
}
