package com.finscanpro.requestLambda.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.TestPropertySource;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * @author Clinton Fernandes
 */
@ExtendWith(MockitoExtension.class)
@TestPropertySource("classpath:application.properties")
public class S3ServiceTest {

    @Mock
    public S3Client s3Client;
    @InjectMocks
    public S3Service s3Service = new S3Service("10", "TestBucket");
    @Mock
    PutObjectRequest putObjectRequest;
    @Mock
    PutObjectPresignRequest putObjectPresignRequest;

    @Test
    public void shouldCreateS3Client() {
        assertNotNull(S3Service.getS3Client());
    }
}
