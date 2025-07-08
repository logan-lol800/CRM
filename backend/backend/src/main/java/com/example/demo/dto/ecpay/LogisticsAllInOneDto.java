package com.example.demo.dto.ecpay;

import com.fasterxml.jackson.annotation.JsonProperty;

// 這個 DTO 對應 PHP 範例 example/Logistics/AllInOne/RedirectToLogisticsSelection.php 中的 $data 陣列
public class LogisticsAllInOneDto {

    @JsonProperty("TempLogisticsID")
    private String tempLogisticsID = "0"; // 首次建立帶 0

    @JsonProperty("GoodsAmount")
    private Integer goodsAmount;

    @JsonProperty("GoodsName")
    private String goodsName;

    @JsonProperty("SenderName")
    private String senderName;

    // 注意，官方文件 v2.0.1 後，這兩個欄位已改為 SenderCellPhone 和 SenderZipCode
    @JsonProperty("SenderZipCode")
    private String senderZipCode;

    @JsonProperty("SenderAddress")
    private String senderAddress;

    @JsonProperty("ServerReplyURL")
    private String serverReplyURL; // 物流狀態變更時，背景通知的網址

    @JsonProperty("ClientReplyURL")
    private String clientReplyURL; // 使用者在綠界頁面操作完後，返回商店的網址

    // Getters and Setters...
    public String getTempLogisticsID() { return tempLogisticsID; }
    public void setTempLogisticsID(String tempLogisticsID) { this.tempLogisticsID = tempLogisticsID; }
    public Integer getGoodsAmount() { return goodsAmount; }
    public void setGoodsAmount(Integer goodsAmount) { this.goodsAmount = goodsAmount; }
    public String getGoodsName() { return goodsName; }
    public void setGoodsName(String goodsName) { this.goodsName = goodsName; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getSenderZipCode() { return senderZipCode; }
    public void setSenderZipCode(String senderZipCode) { this.senderZipCode = senderZipCode; }
    public String getSenderAddress() { return senderAddress; }
    public void setSenderAddress(String senderAddress) { this.senderAddress = senderAddress; }
    public String getServerReplyURL() { return serverReplyURL; }
    public void setServerReplyURL(String serverReplyURL) { this.serverReplyURL = serverReplyURL; }
    public String getClientReplyURL() { return clientReplyURL; }
    public void setClientReplyURL(String clientReplyURL) { this.clientReplyURL = clientReplyURL; }
}