package com.techlabs.repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import com.techlabs.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {

    Customer findByAccountNumber(int receiverAccountNumber);
    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.isActive = false WHERE c.customerId = :customerId")
    void deActivateCustomer(@Param("customerId") int customerId);
    Customer findByCustomerIdAndIsActiveTrue(int customerId);

    Customer findByAccountNumberAndIsActiveTrue(int receiverAccountNumber);
    @Query("SELECT c.identificationNumber FROM Customer c WHERE c.customerId = :customerId and isActive=true")
    Integer findUniqueIdentityByCustomerIdAndIsActive(@Param("customerId") int customerId);
    @Query("SELECT SUM(c.balance) FROM Customer c WHERE c.identificationNumber = :uniqueIdentity and isActive=true")
    int findBalancesByUniqueIdentityAndIsActive(@Param("uniqueIdentity")int identity);

    @Query("SELECT c from Customer c WHERE c.isActive=true")
    Page<Customer> findByIsActiveTrue(Pageable pageable,boolean isActive);

    @Modifying
    @Transactional
    @Query("UPDATE Customer c SET c.isActive = true WHERE c.customerId = :customerId")
    void ActivateCustomer(int customerId);

    Page<Customer> findByIsActiveFalse(Pageable pageable);

    @Query("Select c.balance from Customer c where c.customerId=:customerId and c.isActive=true")
    int findBalanceByCustomerId(@Param("customerId") int customerId);

    Customer findByCustomerIdAndIsActiveFalse(int customerId);
}
