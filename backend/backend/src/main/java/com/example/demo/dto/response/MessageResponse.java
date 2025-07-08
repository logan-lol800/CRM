package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MessageResponse {
    private Long messageId;
    private String questionTitle;
    private Boolean isResolved;
    private LocalDateTime createdAt;
    private Long customerId;

    // 新增預覽用欄位
    private String lastReplyContent;
    private LocalDateTime lastReplyTime;
}
