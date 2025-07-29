package com.edigest.HospiTrack.webconfig;

import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {

    // CORS is already configured in SecurityConfig.java, so commenting this out to avoid conflicts
    /*
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true);

            }
        };
    }
    */
}
