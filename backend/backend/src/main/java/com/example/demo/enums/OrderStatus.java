package com.example.demo.enums;

/**
 * 訂單的生命週期狀態
 */
public enum OrderStatus {
    PENDING_PAYMENT,    // 待付款 (適用於線上支付)
    PENDING_SHIPMENT,   // 待出貨 (線上已付款 或 選擇貨到付款)
    SHIPPED,            // 已出貨
    PENDING_PICKUP,     // 已到達門市 / 待取貨
    COMPLETE,           // 已完成 (顧客已取貨)
    CANCELLED,          // 已取消
    RETURN_REQUESTED,   // 申請退貨
    RETURNED            // 已退貨
}