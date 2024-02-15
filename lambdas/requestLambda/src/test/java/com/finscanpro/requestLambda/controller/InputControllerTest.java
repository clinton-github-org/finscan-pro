package com.finscanpro.requestLambda.controller;

import com.finscanpro.requestLambda.service.S3Service;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

/**
 * @author Clinton Fernandes
 */
@ExtendWith(MockitoExtension.class)
public class InputControllerTest {

    @Mock
    private S3Service s3Service;

    @InjectMocks
    private InputController inputController;

    @Test
    public void testProcessNewRequest() {
        String fileName = "example.pdf";
        String expectedUrl = "http://example.com/presigned-url";

        when(s3Service.getS3PreSignedUrl(Mockito.anyString(), Mockito.anyMap())).thenReturn(expectedUrl);

        ResponseEntity<Object> response = inputController.processNewRequest(fileName);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(expectedUrl, ((Map<String, Object>) Objects.requireNonNull(response.getBody())).get("s3URL"));
    }
}
