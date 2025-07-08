package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

@Configuration
public class JpaAuditingConfiguration {

    @Bean
    public AuditorAware<Long> auditorProvider() {
        // This implementation tells Spring how to find the current user's ID.
        return () -> {
            /*
             * In a production application with Spring Security, you would get the user like this:
             *
             * Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
             * if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
             *     return Optional.empty(); // Or throw an exception if an auditor is always required
             * }
             * UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
             * return Optional.of(userPrincipal.getId());
             */

            // For development, we can return a hardcoded user ID to match the controller logic.
            // This will satisfy the @CreatedBy and @LastModifiedBy annotations.
            return Optional.of(1L);
        };
    }
}
