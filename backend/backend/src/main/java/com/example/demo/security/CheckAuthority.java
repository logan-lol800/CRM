package com.example.demo.security;

import com.example.demo.enums.AuthorityCode;

import java.lang.annotation.*;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CheckAuthority {
    AuthorityCode value();
}
