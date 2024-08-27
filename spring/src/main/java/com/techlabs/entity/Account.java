package com.techlabs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "account")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotNull
    @Column(name = "account_number")
    @NotNull(message = "account number can't be null")
    private int AccountNumber;

    @Column(name = "customer_key")
    @NotNull(message = "customerId can't be null")
    private int customerId;

    @Column(name = "unique_identification_number")
    @NotBlank(message = "unique identification number can't be null")
    private String uniqueIdentificationNumber;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}
