package com.example.demo.dto.ecpay;

import com.fasterxml.jackson.annotation.JsonProperty;

// 這個 DTO 用來接收綠界 API 回傳的 JSON 結構
public class EcpayLogisticsResponseDto {

    @JsonProperty("MerchantID")
    private String merchantID;

    @JsonProperty("TransCode")
    private int transCode;

    @JsonProperty("TransMsg")
    private String transMsg;

    @JsonProperty("Data")
    private String data; // 這裡的 Data 是加密過的 HTML 字串

    // Getters and Setters
    public String getMerchantID() { return merchantID; }
    public void setMerchantID(String merchantID) { this.merchantID = merchantID; }
    public int getTransCode() { return transCode; }
    public void setTransCode(int transCode) { this.transCode = transCode; }
    public String getTransMsg() { return transMsg; }
    public void setTransMsg(String transMsg) { this.transMsg = transMsg; }
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
}