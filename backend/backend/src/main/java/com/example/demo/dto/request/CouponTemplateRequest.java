package com.example.demo.dto.request;

import com.example.demo.enums.CouponType;
import com.example.demo.enums.CouponStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CouponTemplateRequest {
    @NotBlank(message = "優惠券名稱不能為空")
    private String name;

    private String description;

    @NotBlank(message = "優惠券代碼不能為空")
    @Pattern(regexp = "^[A-Z0-9]{6,}$", message = "代碼只能包含6個以上的大寫字母和數字")
    private String code;

    @NotNull(message = "折扣類型不能為空")
    private CouponType couponType;

    @NotNull(message = "折扣值不能為空")
    @Positive(message = "折扣值必須為正數")
    private BigDecimal discountValue;

    @NotNull(message = "最低消費金額不能為空")
    @PositiveOrZero(message = "最低消費金額不能為負數")
    private BigDecimal minPurchaseAmount;

    @Future(message = "有效開始日期必須是未來時間")
    private LocalDateTime validFrom;

    @Future(message = "有效結束日期必須是未來時間")
    private LocalDateTime validTo;

    @NotNull(message = "總發行量不能為空")
    @Min(value = 1, message = "總發行量至少為1")
    private Integer totalQuantity;

    @NotNull(message = "狀態不能為空")
    private CouponStatus status;
}