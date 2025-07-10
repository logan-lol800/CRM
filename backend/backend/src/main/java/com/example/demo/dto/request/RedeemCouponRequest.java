package com.example.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RedeemCouponRequest {
    @NotBlank(message = "優惠券代碼不可為空")
    private String code;
}