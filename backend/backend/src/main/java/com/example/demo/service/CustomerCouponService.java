package com.example.demo.service;

import com.example.demo.entity.CCustomer;
import com.example.demo.entity.CouponTemplate;
import com.example.demo.entity.CustomerCoupon;
import com.example.demo.enums.CouponStatus;
import com.example.demo.enums.CustomerCouponStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CCustomerRepo;
import com.example.demo.repository.CouponTemplateRepository;
import com.example.demo.repository.CustomerCouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CustomerCouponService {

    private final CustomerCouponRepository customerCouponRepository;
    private final CouponTemplateRepository couponTemplateRepository;
    private final CCustomerRepo cCustomerRepo;

    @Transactional
    public CustomerCoupon grantCouponToCustomer(CCustomer customer, CouponTemplate template) {
        // 建立用戶優惠券實例
        CustomerCoupon customerCoupon = CustomerCoupon.builder()
                .customer(customer)
                .couponTemplate(template)
                .build();

        // 儲存用戶優惠券
        CustomerCoupon savedCustomerCoupon = customerCouponRepository.save(customerCoupon);

        // 更新模板的已發行數量
        template.setIssuedQuantity(template.getIssuedQuantity() + 1);
        couponTemplateRepository.save(template);

        return savedCustomerCoupon;
    }

    @Transactional
    public CustomerCoupon redeemCoupon(Long customerId, String couponCode) {
        // 1. 找到顧客
        CCustomer customer = cCustomerRepo.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("找不到顧客 ID: " + customerId));

        // 2. 根據代碼找到優惠券模板
        CouponTemplate template = couponTemplateRepository.findByCode(couponCode)
                .orElseThrow(() -> new ResourceNotFoundException("無效的優惠券代碼: " + couponCode));

        // 3. 【驗證邏輯】(維持不變)
        if (template.getStatus() != CouponStatus.ACTIVE) {
            throw new IllegalStateException("此優惠券活動尚未開始或已結束。");
        }
        if (LocalDateTime.now().isBefore(template.getValidFrom()) || LocalDateTime.now().isAfter(template.getValidTo())) {
            throw new IllegalStateException("此優惠券不在可兌換的時間範圍內。");
        }
        if (template.getIssuedQuantity() >= template.getTotalQuantity()) {
            throw new IllegalStateException("此優惠券已被兌換完畢。");
        }
        boolean alreadyRedeemed = customerCouponRepository.existsByCustomerAndCouponTemplate(customer, template);
        if (alreadyRedeemed) {
            throw new IllegalStateException("您已經兌換過此優惠券了。");
        }

        // 4. 【修正後的建立邏輯】
        // 我們只需要設定關聯即可，status 和 receivedAt 會由 @PrePersist 自動處理
        CustomerCoupon newCoupon = CustomerCoupon.builder()
                .customer(customer)
                .couponTemplate(template)
                .build();

        // 5. 更新模板的已發行數量 (維持不變)
        template.setIssuedQuantity(template.getIssuedQuantity() + 1);
        couponTemplateRepository.save(template);

        // 6. 儲存並回傳新的優惠券實例 (維持不變)
        return customerCouponRepository.save(newCoupon);
    }
}