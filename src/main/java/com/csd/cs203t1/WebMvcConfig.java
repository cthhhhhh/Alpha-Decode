package com.csd.cs203t1;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**") // Match all paths
                .addResourceLocations("classpath:/static/") // Look in static folder
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        if (resourcePath.startsWith("api/") || resourcePath.startsWith("api")) {
                            return null; // Let it 404 naturally for API calls
                        }
                        Resource requestedResource = location.createRelative(resourcePath);
                        // If the file exists (like an image or JS file) and is readable, serve it.
                        // Otherwise, if it's a frontend route (like /user/profile), return index.html.
                        return (requestedResource.exists() && requestedResource.isReadable()) 
                                ? requestedResource 
                                : location.createRelative("index.html");
                    }
                });
    }
}
