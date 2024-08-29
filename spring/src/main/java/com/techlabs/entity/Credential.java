package com.techlabs.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "authentication")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_id")
    @NotNull
    private int userId;
    @Column(name = "customer_id")
    @NotNull
    private int customerId;

    @Column(name = "password", nullable = false)
    @NotBlank
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    // Enum for Role
    public enum Role {
        ROLE_ADMIN,
        ROLE_CUSTOMER
    }
}