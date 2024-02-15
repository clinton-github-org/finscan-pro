package com.finscanpro.requestLambda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.finscanpro.requestLambda")
public class RequestLambdaApplication {

    public static void main(String[] args) {
        SpringApplication.run(RequestLambdaApplication.class, args);
    }

}
