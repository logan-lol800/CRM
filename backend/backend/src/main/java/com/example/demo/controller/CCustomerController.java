package com.example.demo.controller;


import com.example.demo.dto.request.CCustomerRegisterRequest;
import com.example.demo.dto.request.RedeemCouponRequest;
import com.example.demo.dto.request.UpdateCCustomerProfileRequest;
import com.example.demo.dto.response.CCustomerProfileResponse;
import com.example.demo.entity.CCustomer;
import com.example.demo.exception.JwtAuthException;
import com.example.demo.security.CheckCustomerActive;
import com.example.demo.security.CheckJwt;
import com.example.demo.security.JwtTool;
import com.example.demo.security.JwtUserPayload;
import com.example.demo.service.CCustomerService;
import com.example.demo.service.CustomerCouponService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

///register, /update-profile, /delete-account
/// 帳戶基本操作
@RestController
@RequestMapping("/api/customer")
public class CCustomerController {
    private final CCustomerService cCustomerService;
    private final CustomerCouponService customerCouponService;

    public CCustomerController(CCustomerService cCustomerService, CustomerCouponService customerCouponService) {
        this.cCustomerService = cCustomerService;
        this.customerCouponService = customerCouponService;
    }

    @Operation(summary = "檢查電子郵件是否存在")
    @GetMapping("/emailcheck")
    public ResponseEntity<Map<String, Object>> emailcheck(@RequestParam String email) {
        boolean exists = cCustomerService.checkEmailExist(email);
        Map<String, Object> result = new HashMap<>();
        result.put("exists", exists);
        result.put("message", exists ? "true" : "false");
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "註冊新客戶")
    @PostMapping("/register")
    public ResponseEntity<CCustomer> register(@RequestBody CCustomerRegisterRequest req){
        CCustomer cCustomer =  cCustomerService.register(
                req.getAccount(),
                req.getCustomerName(),
                req.getPassword(),
                req.getEmail(),
                req.getAddress(),
                req.getBirthday()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(cCustomer);
    }

//    @CheckJwt // 自訂註解 + 切面處理
//    @GetMapping("/profile")
//    public CCustomerProfileResponse getProfile(@RequestAttribute("account") String account) {
//
//        return cCustomerService.getProfile(account);
//    }


    @Operation(summary = "獲取當前客戶資料 (需要 JWT)")
    @CheckJwt
    @GetMapping("/profile")
    public ResponseEntity<CCustomerProfileResponse> getProfile(HttpServletRequest request) {
        String account = (String) request.getAttribute("account");
        System.out.println("profile endpoint account = " + account);
        return ResponseEntity.ok(cCustomerService.getProfile(account));
    }

    @Operation(summary = "更新當前客戶資料 (需要 JWT)")
    @CheckJwt
    @PutMapping("/profile/update")
    public ResponseEntity<CCustomerProfileResponse> updateProfile(
            HttpServletRequest request,
            @RequestBody UpdateCCustomerProfileRequest updateRequest) {

        String account = (String) request.getAttribute("account");

        CCustomerProfileResponse updatedProfile = cCustomerService.updateProfile(account, updateRequest);

        return ResponseEntity.ok(updatedProfile);
    }

    @CheckJwt
    @CheckCustomerActive
    @DeleteMapping("/account")
    public ResponseEntity<Void> deleteOwnAccount(HttpServletRequest request) {
        String account = (String) request.getAttribute("account");
        cCustomerService.deleteAccountPermanently(account);
        return ResponseEntity.noContent().build();
    }

    // 忘記密碼：寄送重設密碼連結（這裡模擬直接取得 token）
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        String token = cCustomerService.generateResetToken(email);
        return ResponseEntity.ok("請使用此連結重設密碼: /customer/reset-password?token=" + token);
    }

    // 使用 token 重設密碼
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        cCustomerService.resetPassword(token, newPassword);
        return ResponseEntity.ok("密碼已成功重設！");
    }

    /**
     * 【改寫後】兌換優惠券的 API 端點
     * POST /api/customer/coupons/redeem
     */
    @PostMapping("/coupons/redeem")
    @CheckJwt // 【修改重點 1】加上這個註解來啟用 JWT 驗證
    public ResponseEntity<?> redeemCoupon(@Valid @RequestBody RedeemCouponRequest redeemRequest, HttpServletRequest request) { //【修改重點 2】注入 HttpServletRequest
        try {
            // 【修改重點 3】呼叫輔助方法從 request 中獲取 customerId
            Long customerId = getCustomerIdFromRequest(request);

            customerCouponService.redeemCoupon(customerId, redeemRequest.getCode());
            return ResponseEntity.ok().body(Map.of("success", true, "message", "優惠券兌換成功！"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * 【新增】從 HttpServletRequest 中獲取 customerId 的輔助方法
     * 這個方法假設您的 @CheckJwt 切面會將 JwtUserPayload 物件存入 request 的 attribute 中。
     */
    private Long getCustomerIdFromRequest(HttpServletRequest request) {
        // "userPayload" 這個鍵名必須與您在 JwtAspect 中設定的鍵名完全一致
        Object payloadObject = request.getAttribute("userPayload");

        if (!(payloadObject instanceof JwtUserPayload userPayload)) {
            // 如果找不到或類型不對，拋出例外
            throw new JwtAuthException("無法從請求中獲取有效的使用者資訊");
        }

        // 從 payload 中返回 customerId
        return userPayload.getId();
    }
}
