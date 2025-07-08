package com.example.demo.specification;


import com.example.demo.entity.Inventory;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class InventorySpecification {

    public static Specification<Inventory> findByCriteria(Long productId, Long warehouseId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (productId != null) {
                predicates.add(criteriaBuilder.equal(root.get("product").get("productId"), productId));
            }

            if (warehouseId != null) {
                predicates.add(criteriaBuilder.equal(root.get("warehouse").get("warehouseId"), warehouseId));
            }


            query.orderBy(criteriaBuilder.asc(root.get("product").get("productId")), criteriaBuilder.asc(root.get("warehouse").get("warehouseId")));

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}