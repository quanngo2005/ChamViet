package com.vn.chamviet.chamviet_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
@EnableCaching
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.vn.chamviet.chamviet_api")
public class ChamvietApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChamvietApiApplication.class, args);
	}

}
