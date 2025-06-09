package com.ninfinances.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "transactions")
public class Transaction {
    @Id
    private String id;
    private String description;
    private Long amount;
    private String date;
    private String userId;
} 