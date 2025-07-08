package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MessageReplyResponse {
    private Long replyId;
    private String content;
    private String senderType; // CUSTOMER / STAFF
    private String senderName; // 顧客名稱或員工名稱
    private LocalDateTime sentAt;
}
