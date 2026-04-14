package com.vn.chamviet.chamviet_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.vn.chamviet.chamviet_api.user")
public class ChamvietApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChamvietApiApplication.class, args);
	}

}
