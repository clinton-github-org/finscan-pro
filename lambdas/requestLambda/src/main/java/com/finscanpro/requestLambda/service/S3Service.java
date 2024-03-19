package com.finscanpro.requestLambda.service;

import com.finscanpro.requestLambda.exceptions.S3ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
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

    private static String duration;
    private static String bucketName;

    public S3Service(@Value("${S3_PRESIGNURL_DURATION}") String duration, @Value("${BUCKET_NAME}") String bucketName) {
        S3Service.duration = duration;
        S3Service.bucketName = bucketName;
    }

    public static S3Client getS3Client() {
        if (s3Client != null) {
            return s3Client;
        } else {
            throw new S3ServiceException("Failed to retrieve S3 client!", new Exception("S3 Client error"));
        }
    }

    public String getS3PreSignedUrl(String keyName, Map<String, String> metadata) {
        try (S3Presigner s3Presigner = S3Presigner.builder().region(Region.AP_SOUTH_1).build()) {

            PutObjectRequest putObjectRequest = PutObjectRequest.builder().bucket(bucketName).key(keyName).metadata(metadata).contentType("*/*").build();

            PutObjectPresignRequest putObjectPresignRequest = PutObjectPresignRequest.builder().signatureDuration(Duration.ofMinutes(Integer.parseInt(duration))).putObjectRequest(putObjectRequest).build();

            PresignedPutObjectRequest presignedPutObjectRequest = s3Presigner.presignPutObject(putObjectPresignRequest);

            return presignedPutObjectRequest.url().toExternalForm();
        } catch (Exception exception) {
            throw new S3ServiceException("Failed to create S3 PreSigned URL", exception);
        }
    }
}
