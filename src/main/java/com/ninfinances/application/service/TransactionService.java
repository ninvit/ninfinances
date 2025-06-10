package com.ninfinances.application.service;

import com.ninfinances.domain.model.Transaction;
import com.ninfinances.domain.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public List<Transaction> getAllTransactions(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction getTransaction(String id, String userId) {
        return transactionRepository.findById(id)
                .filter(t -> t.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public Transaction updateTransaction(String id, Transaction transaction, String userId) {
        Transaction existingTransaction = getTransaction(id, userId);
        transaction.setId(existingTransaction.getId());
        transaction.setUserId(userId);
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(String id, String userId) {
        Transaction transaction = getTransaction(id, userId);
        transactionRepository.delete(transaction);
    }
} 