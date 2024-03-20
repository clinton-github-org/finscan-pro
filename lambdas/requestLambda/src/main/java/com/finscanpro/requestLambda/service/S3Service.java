package com.finscanpro.requestLambda.service;

import com.finscanpro.requestLambda.exceptions.S3ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.Map;

/**
 * @author Clinton Fernandes
 */
@Component
public class S3Service {

    public static final S3Client s3Client = S3Client.builder().region(Region.AP_SOUTH_1).httpClient(UrlConnectionHttpClient.builder().build()).build();
    private static final Logger logger = LoggerFactory.getLogger(S3Service.class);
    private static String duration;
    private static String bucketName;

    public S3Service(@Value("${S3_PRESIGNURL_DURATION}") String duration, @Value("${BUCKET_NAME}") String bucketName) {
        S3Service.duration = duration;
        S3Service.bucketName = bucketName;
    }

    public void putS3Object(String keyName) {
        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(keyName)
                    .build();
            s3Client.putObject(putObjectRequest, RequestBody.empty());
        } catch (Exception exception) {
            throw new S3ServiceException("Failed to create object: ".concat(keyName), exception);
        }
    }

    public static S3Client getS3Client() {
        if (s3Client != null) {
            return s3Client;
        } else {
            throw new S3ServiceException("Failed to retrieve S3 client!", new Exception("S3 Client error"));
        }
    }

    public String getS3PreSignedUrl(String keyName, Map<String, String> metadata, String contentType) {
        try (S3Presigner s3Presigner = S3Presigner.builder().region(Region.AP_SOUTH_1).credentialsProvider(DefaultCredentialsProvider.create()).build()) {

            PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucketName).key(keyName).contentType(contentType).metadata(metadata).build();

            PutObjectPresignRequest putObjectPresignRequest = PutObjectPresignRequest.builder().signatureDuration(Duration.ofMinutes(Integer.parseInt(duration))).putObjectRequest(putObjectRequest).build();

            PresignedPutObjectRequest presignedPutObjectRequest = s3Presigner.presignPutObject(putObjectPresignRequest);

            logger.info("Presigned URL to upload a file to: [{}]", presignedPutObjectRequest.url().toString());
            logger.info("HTTP method: [{}]", presignedPutObjectRequest.httpRequest().method());

            return presignedPutObjectRequest.url().toString();
        } catch (Exception exception) {
            throw new S3ServiceException("Failed to create S3 PreSigned URL", exception);
        }
    }
}
