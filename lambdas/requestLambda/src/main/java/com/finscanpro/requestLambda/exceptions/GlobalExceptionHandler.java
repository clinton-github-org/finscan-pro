package com.finscanpro.requestLambda.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Clinton Fernandes
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(S3ServiceException.class)
    public ResponseEntity<Object> handleS3ServiceException(S3ServiceException s3ServiceException) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", s3ServiceException.getMessage());
        logger.error("Exception :: ", s3ServiceException);
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleException(Exception exception) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", "An error occurred");
        logger.error("Exception :: ", exception);
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
