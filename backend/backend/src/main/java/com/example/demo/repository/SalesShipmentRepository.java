package com.example.demo.repository;

import com.example.demo.entity.SalesShipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesShipmentRepository extends JpaRepository<SalesShipment, Long> {
}
