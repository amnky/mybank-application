package com.techlabs.entity;

import com.techlabs.utils.TransactionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="transactions")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @NotNull
    @Column(name="transaction_id")
    private int transactionId;

    @NotNull
    @Column(name="sender_account_no")
    private int senderAccountNo;

    @NotNull
    @Column(name="receiver_account_no")
    private int receiverAccountNo;

    @NotNull
    @Column(name="customer_key")
    private int customerId;

    @Column(name="transaction_time")
    private LocalDateTime transactionTime;

    @NotNull
    @Column(name="transaction_amount")
    private int transactionAmount;

    @NotNull
    @Column(name="status")
    private Boolean status;

    @Column(name="transaction_type")
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;


    public Transaction(int senderAccountNo, int receiverAccountNo, int customerId, LocalDateTime transactionTime,
                       int transactionAmount, Boolean status, TransactionType transactionType) {
        this.senderAccountNo = senderAccountNo;
        this.receiverAccountNo = receiverAccountNo;
        this.customerId = customerId;
        this.transactionTime = transactionTime;
        this.transactionAmount = transactionAmount;
        this.status = status;
    }
}
