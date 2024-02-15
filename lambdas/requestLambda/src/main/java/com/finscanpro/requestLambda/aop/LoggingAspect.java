package com.finscanpro.requestLambda.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * @author Clinton Fernandes
 */


@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Pointcut("execution(* com.finscanpro.requestLambda..*.*(..))" + "!execution(* com.finscanpro.requestLambda.aop.*.*(..))" + "!execution(* com.finscanpro.requestLambda.exceptions.*.*(..))")
    public void logPointcutWithExecution() {
    }

    @Around("logPointcutWithExecution()")
    public Object logMethodCallsWithExecutionAdvise(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Object value;
        logger.info(proceedingJoinPoint.getTarget().getClass() + " :: " + proceedingJoinPoint.getSignature().getName() + " :: starting execution");
        value = proceedingJoinPoint.proceed();
        logger.info(proceedingJoinPoint.getTarget().getClass() + " :: " + proceedingJoinPoint.getSignature().getName() + " :: ending execution");
        return value;
    }
}
