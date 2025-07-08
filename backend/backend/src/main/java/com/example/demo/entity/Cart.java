package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Getter
@Setter
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartid;
    private LocalDateTime createat;
    private LocalDateTime updateat;

    //------------
    @OneToOne
    @JoinColumn(name = "customer_id")
    private CCustomer CCustomer;

    //------------
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartDetail> cartdetails = new ArrayList<>();

    // **重要**: 提供一個輔助方法來同步雙方的關係，避免資料不一致
    public void addCartDetail(CartDetail cartDetail) {
        cartdetails.add(cartDetail);
        cartDetail.setCart(this);
    }

    public void removeCartDetail(CartDetail cartDetail) {
        cartdetails.remove(cartDetail);
        cartDetail.setCart(null);
    }

}
