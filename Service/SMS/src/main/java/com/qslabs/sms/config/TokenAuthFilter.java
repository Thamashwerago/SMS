package com.qslabs.sms.config;

import com.qslabs.sms.dto.AuthDTO;
import com.qslabs.sms.service.impl.RedisTokenService;
import com.qslabs.sms.util.Constants;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class TokenAuthFilter extends OncePerRequestFilter {

    @Autowired
    private RedisTokenService redisTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = request.getHeader(Constants.AUTH_HEADER);

        if (token != null && redisTokenService.isValid(token)) {
            AuthDTO tokenData = redisTokenService.getTokenData(token);

            if (tokenData != null && tokenData.getRole() != null) {
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + tokenData.getRole());
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(tokenData.getUsername(), null, Collections.singletonList(authority));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
