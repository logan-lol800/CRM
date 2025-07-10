package com.example.demo.controller;

import com.example.demo.dto.request.CouponTemplateRequest; // 我們等一下會建立這個 DTO
import com.example.demo.dto.response.CouponTemplateDto;   // 同樣，等一下會建立
import com.example.demo.service.CouponTemplateService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
// 【重要】將 API 路徑統一前綴為 /api/coupons
// 您的前端 axiosBackend 的 baseURL 是 '/api'，所以這裡的路徑會對應到 /api/coupons
@RequestMapping("/api/coupons")
public class CouponTemplateController {

    private final CouponTemplateService couponTemplateService;

    // 使用建構子注入 Service
    public CouponTemplateController(CouponTemplateService couponTemplateService) {
        this.couponTemplateService = couponTemplateService;
    }

    /**
     * 獲取所有優惠券模板 (分頁)
     * GET /api/coupons?page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Page<CouponTemplateDto>> getAllCoupons(Pageable pageable) {
        Page<CouponTemplateDto> coupons = couponTemplateService.findAll(pageable);
        return ResponseEntity.ok(coupons);
    }

    /**
     * 根據 ID 獲取單一優惠券模板
     * GET /api/coupons/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<CouponTemplateDto> getCouponById(@PathVariable Long id) {
        CouponTemplateDto coupon = couponTemplateService.findById(id);
        return ResponseEntity.ok(coupon);
    }

    /**
     * 建立一個新的優惠券模板
     * POST /api/coupons
     */
    @PostMapping
    public ResponseEntity<CouponTemplateDto> createCoupon(@Valid @RequestBody CouponTemplateRequest request) {
        CouponTemplateDto createdCoupon = couponTemplateService.create(request);
        return new ResponseEntity<>(createdCoupon, HttpStatus.CREATED);
    }

    /**
     * 更新一個已存在的優惠券模板
     * PUT /api/coupons/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<CouponTemplateDto> updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponTemplateRequest request) {
        CouponTemplateDto updatedCoupon = couponTemplateService.update(id, request);
        return ResponseEntity.ok(updatedCoupon);
    }

    /**
     * 刪除一個優惠券模板
     * DELETE /api/coupons/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponTemplateService.delete(id);
        return ResponseEntity.noContent().build();
    }
}