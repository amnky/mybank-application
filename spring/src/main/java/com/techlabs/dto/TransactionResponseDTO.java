package com.techlabs.dto;

import com.techlabs.utils.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponseDTO {
    private int transactionId;
    private int SenderAccountNo;
    private int ReceiverAccountNo;
    private int amount;
    private String status;
    private LocalDateTime transactionDate;


    public TransactionResponseDTO(int senderAccountNo, int receiverAccountNo, int amount, LocalDateTime transactionDate) {
        SenderAccountNo = senderAccountNo;
        ReceiverAccountNo = receiverAccountNo;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }
}
