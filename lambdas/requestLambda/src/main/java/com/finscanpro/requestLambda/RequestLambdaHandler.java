package com.finscanpro.requestLambda;

import com.amazonaws.serverless.exceptions.ContainerInitializationException;
import com.amazonaws.serverless.proxy.model.AwsProxyRequest;
import com.amazonaws.serverless.proxy.model.AwsProxyResponse;
import com.amazonaws.serverless.proxy.spring.SpringBootLambdaContainerHandler;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Clinton Fernandes
 */
@SuppressWarnings("unused")
public class RequestLambdaHandler implements RequestHandler<AwsProxyRequest, AwsProxyResponse> {

    private static final Logger logger = LoggerFactory.getLogger(RequestLambdaHandler.class);

    private static final SpringBootLambdaContainerHandler<AwsProxyRequest, AwsProxyResponse> handler;

    static {
        try {
            handler = SpringBootLambdaContainerHandler.getAwsProxyHandler(RequestLambdaApplication.class);
        } catch (ContainerInitializationException ex) {
            logger.error("Unable to load spring boot application", ex);
            throw new RuntimeException("Unable to load spring boot application");
        }
    }

    @Override
    public AwsProxyResponse handleRequest(AwsProxyRequest awsProxyRequest, Context context) {
        return handler.proxy(awsProxyRequest, context);
    }
}
