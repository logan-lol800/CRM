package com.example.demo.dto.response;

import com.example.demo.enums.CouponStatus;
import com.example.demo.enums.CouponType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CouponTemplateDto {
    private Long id;
    private String name;
    private String description;
    private String code;
    private CouponType couponType;
    private BigDecimal discountValue;
    private BigDecimal minPurchaseAmount;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private Integer totalQuantity;
    private Integer issuedQuantity;
    private CouponStatus status;
}