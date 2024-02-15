package com.finscanpro.requestLambda.exceptions;

/**
 * @author Clinton Fernandes
 */
public class S3ServiceException extends RuntimeException {

    public S3ServiceException(String errorMessage, Exception exception) {
        super(errorMessage, exception);
    }
}
