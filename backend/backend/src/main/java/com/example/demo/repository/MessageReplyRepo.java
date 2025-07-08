package com.example.demo.repository;

import com.example.demo.entity.MessageReply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageReplyRepo extends JpaRepository<MessageReply, Long> {
    List<MessageReply> findByMessage_MessageId(Long messageId);
    List<MessageReply> findBycCustomer_CustomerId(Long customerId);
    List<MessageReply> findByUser_UserId(Long userId);
}
