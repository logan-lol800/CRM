package com.example.demo.dto.ecpay;

import com.fasterxml.jackson.annotation.JsonProperty;

// T 可以是 String (加密後) 或 任何 DTO (加密前)
public class EcpayRequestDto<T> {

    @JsonProperty("MerchantID")
    private String merchantID;

    @JsonProperty("RqHeader")
    private RqHeader rqHeader;

    @JsonProperty("Data")
    private T data;

    // Getters and Setters...
    public String getMerchantID() { return merchantID; }
    public void setMerchantID(String merchantID) { this.merchantID = merchantID; }
    public RqHeader getRqHeader() { return rqHeader; }
    public void setRqHeader(RqHeader rqHeader) { this.rqHeader = rqHeader; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public static class RqHeader {
        @JsonProperty("Timestamp")
        private long timestamp;

        @JsonProperty("Revision")
        private String revision = "1.0.0";

        // Getters and Setters...
        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
        public String getRevision() { return revision; }
        public void setRevision(String revision) { this.revision = revision; }
    }
}