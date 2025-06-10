package com.ninfinances.domain.repository;

import com.ninfinances.domain.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserId(String userId);
    
    @Query("{ '$or': [{ 'userId': ?0 }, { 'userId': { '$oid': ?0 } }] }")
    List<Transaction> findByUserIdFlexible(String userId);
} 