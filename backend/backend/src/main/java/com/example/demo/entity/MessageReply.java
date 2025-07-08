package com.example.demo.entity;

import com.example.demo.enums.SenderType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "message_reply")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageReply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long replyId;

    // 對應問題
    @ManyToOne
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    // 使用者還是客戶留言
    @Enumerated(EnumType.STRING)
    private SenderType senderType; // CUSTOMER / STAFF

    // 留言內容
    @Column(nullable = false)
    private String content;

    private LocalDateTime sentAt;

    // 若為客戶留言
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private CCustomer cCustomer;

    // 若為後台人員回覆
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 紀錄留言時間
    @PrePersist
    public void onSend() {
        this.sentAt = LocalDateTime.now();
    }
}
