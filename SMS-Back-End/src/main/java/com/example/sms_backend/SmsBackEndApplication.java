package com.example.sms_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients // Enable Feign Clients
public class SmsBackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmsBackEndApplication.class, args);
    }

}
