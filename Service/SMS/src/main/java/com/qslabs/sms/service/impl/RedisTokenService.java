package com.qslabs.sms.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qslabs.sms.dto.AuthDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class RedisTokenService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final long EXPIRATION = 60 * 60; // 60 minutes
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void saveToken(String token,String username , Long userId,String role) {
        try {
            AuthDTO tokenData = new AuthDTO(token,username,userId,role);
            String value = objectMapper.writeValueAsString(tokenData);
            redisTemplate.opsForValue().set(token, value, Duration.ofSeconds(EXPIRATION));
        } catch (Exception e) {
            throw new RuntimeException("Failed to save token", e);
        }
    }

    public AuthDTO getTokenData(String token) {
        try {
            String value = redisTemplate.opsForValue().get(token);
            return objectMapper.readValue(value, AuthDTO.class);
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isValid(String token) {
        return redisTemplate.hasKey(token);
    }

    public void deleteToken(String token) {
        redisTemplate.delete(token);
    }
}

