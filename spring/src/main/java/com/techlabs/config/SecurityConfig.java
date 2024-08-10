package com.techlabs.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.techlabs.security.JwtAuthenticationEntryPoint;
import com.techlabs.security.JwtAuthenticationFilter;

@Configuration
//@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint authenticationEntryPoint;

    private final JwtAuthenticationFilter authenticationFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint authenticationEntryPoint,
                          JwtAuthenticationFilter authenticationFilter) {
        this.authenticationEntryPoint = authenticationEntryPoint;
        this.authenticationFilter = authenticationFilter;
    }

    @Bean
    static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf((csrf) -> csrf.disable())
                .authorizeHttpRequests((authorize) ->
                                authorize
//                        .requestMatchers(HttpMethod.GET, "/api/students/**").permitAll()
                                        .requestMatchers(HttpMethod.POST, "/api/admin/**").hasRole("ADMIN")
                                        .requestMatchers(HttpMethod.GET, "/api/admin/**").hasRole("ADMIN")
                                        .requestMatchers(HttpMethod.DELETE, "/api/admin/**").hasRole("ADMIN")
                                        .requestMatchers(HttpMethod.PUT, "/api/admin/**").hasRole("ADMIN")
                                        .requestMatchers(HttpMethod.PATCH, "/api/admin/**").hasRole("ADMIN")

                                        .requestMatchers(HttpMethod.POST, "/api/customer/**").hasRole("CUSTOMER")
                                        .requestMatchers(HttpMethod.GET, "/api/customer/**").hasRole("CUSTOMER")
                                        .requestMatchers(HttpMethod.DELETE, "/api/customer/**").hasRole("ADMIN")
                                        .requestMatchers(HttpMethod.PUT, "/api/customer/**").hasRole("CUSTOMER")
                                        .requestMatchers(HttpMethod.PATCH, "/api/customer/**").hasRole("CUSTOMER")
                                        .requestMatchers("/api/auth/**").permitAll()
                                        .anyRequest().authenticated()

                ).exceptionHandling( exception -> exception
                        .authenticationEntryPoint(authenticationEntryPoint)
                ).sessionManagement( session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
