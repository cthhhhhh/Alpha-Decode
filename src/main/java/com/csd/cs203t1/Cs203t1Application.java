package com.csd.cs203t1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Cs203t1Application {

    public static void main(String[] args) {
        SpringApplication.run(Cs203t1Application.class, args);
    }

}