package com.example.demo.service;

import com.example.demo.dto.request.CouponTemplateRequest;
import com.example.demo.dto.response.CouponTemplateDto;
import com.example.demo.entity.CouponTemplate;
import com.example.demo.repository.CouponTemplateRepository;
import com.example.demo.exception.ResourceNotFoundException; // 假設您有這個自訂例外
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CouponTemplateService {

    private final CouponTemplateRepository couponTemplateRepository;

    public CouponTemplate findTemplateByCode(String code) {
        return couponTemplateRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("CouponTemplate with code " + code + " not found."));
    }

    @Transactional(readOnly = true)
    public Page<CouponTemplateDto> findAll(Pageable pageable) {
        return couponTemplateRepository.findAll(pageable).map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public CouponTemplateDto findById(Long id) {
        return couponTemplateRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("找不到 ID 為 " + id + " 的優惠券"));
    }

    @Transactional
    public CouponTemplateDto create(CouponTemplateRequest request) {
        CouponTemplate couponTemplate = CouponTemplate.builder()
                .name(request.getName())
                .description(request.getDescription())
                .code(request.getCode())
                .couponType(request.getCouponType())
                .discountValue(request.getDiscountValue())
                .minPurchaseAmount(request.getMinPurchaseAmount())
                .validFrom(request.getValidFrom())
                .validTo(request.getValidTo())
                .totalQuantity(request.getTotalQuantity())
                .status(request.getStatus())
                .build();

        CouponTemplate saved = couponTemplateRepository.save(couponTemplate);
        return convertToDto(saved);
    }

    @Transactional
    public CouponTemplateDto update(Long id, CouponTemplateRequest request) {
        CouponTemplate existing = couponTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("找不到 ID 為 " + id + " 的優惠券"));

        // 更新屬性...
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        // ...更新其他所有欄位

        CouponTemplate updated = couponTemplateRepository.save(existing);
        return convertToDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!couponTemplateRepository.existsById(id)) {
            throw new ResourceNotFoundException("找不到 ID 為 " + id + " 的優惠券");
        }
        couponTemplateRepository.deleteById(id);
    }

    // 私有輔助方法，將 Entity 轉為 DTO
    private CouponTemplateDto convertToDto(CouponTemplate entity) {
        return CouponTemplateDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .code(entity.getCode())
                .couponType(entity.getCouponType())
                .discountValue(entity.getDiscountValue())
                .minPurchaseAmount(entity.getMinPurchaseAmount())
                .validFrom(entity.getValidFrom())
                .validTo(entity.getValidTo())
                .totalQuantity(entity.getTotalQuantity())
                .issuedQuantity(entity.getIssuedQuantity())
                .status(entity.getStatus())
                .build();
    }
}