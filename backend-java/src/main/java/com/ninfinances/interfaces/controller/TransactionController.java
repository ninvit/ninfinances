package com.ninfinances.interfaces.controller;

import com.ninfinances.application.service.TransactionService;
import com.ninfinances.domain.model.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("userId");
        return ResponseEntity.ok(transactionService.getAllTransactions(userId));
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestBody Transaction transaction,
            @AuthenticationPrincipal Jwt jwt) {
        transaction.setUserId(jwt.getClaimAsString("userId"));
        return ResponseEntity.ok(transactionService.createTransaction(transaction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransaction(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("userId");
        return ResponseEntity.ok(transactionService.getTransaction(id, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable String id,
            @RequestBody Transaction transaction,
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("userId");
        return ResponseEntity.ok(transactionService.updateTransaction(id, transaction, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getClaimAsString("userId");
        transactionService.deleteTransaction(id, userId);
        return ResponseEntity.noContent().build();
    }
} 