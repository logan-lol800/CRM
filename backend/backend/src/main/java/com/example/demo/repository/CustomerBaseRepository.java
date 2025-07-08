package com.example.demo.repository;

import com.example.demo.entity.CustomerBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerBaseRepository extends JpaRepository<CustomerBase, Long> {
}
