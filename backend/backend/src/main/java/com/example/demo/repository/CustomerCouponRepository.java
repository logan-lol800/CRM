package com.example.demo.repository;

import com.example.demo.entity.CCustomer;
import com.example.demo.entity.CouponTemplate;
import com.example.demo.entity.CustomerCoupon;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerCouponRepository extends JpaRepository<CustomerCoupon, Long> {
    boolean existsByCustomerAndCouponTemplate(CCustomer customer, CouponTemplate template);
}
