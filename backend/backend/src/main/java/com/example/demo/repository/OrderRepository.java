package com.example.demo.repository;

import com.example.demo.entity.Order;
import com.example.demo.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // 查詢某個使用者的所有歷史訂單，並按日期降序排列
    List<Order> findByCCustomer_CustomerIdOrderByOrderdateDesc(Long customerId);

    // (給後台管理用) 根據訂單狀態查詢，並支援分頁
    Page<Order> findByOrderStatus(OrderStatus status, Pageable pageable);

    // ★★★ 新增的自訂查詢方法 ★★★
    @Query("""
            SELECT DISTINCT o FROM Order o JOIN o.orderDetails od WHERE 
            o.orderdate BETWEEN :startTime AND :endTime AND 
            (:productName IS NULL OR od.product.name LIKE %:productName%)
            """)
    List<Order> searchOrders(
            @Param("startTime") LocalDate startTime,
            @Param("endTime") LocalDate endTime,
            @Param("productName") String productName
    );

    // ====================== 【以下為新增的程式碼】 ======================
    /**
     * 根據商家交易單號查找訂單
     * @param merchantTradeNo 綠界使用的交易單號
     * @return 找到的訂單
     */
    Optional<Order> findByMerchantTradeNo(String merchantTradeNo);
    // ===============================================================
}
