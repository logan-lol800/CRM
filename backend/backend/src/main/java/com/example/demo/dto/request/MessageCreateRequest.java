package com.example.demo.dto.request;

import lombok.Data;

@Data
public class MessageCreateRequest {
    private String questionTitle;
    // 首則留言內容
    private String content;
}

