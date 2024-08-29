package com.techlabs.service;

import com.techlabs.dto.AccountResponseDTO;
import com.techlabs.dto.TransactionDTO;
import com.techlabs.dto.TransactionResponseDTO;
import com.techlabs.dto.TransferResponseDTO;
import com.techlabs.entity.Customer;
import com.techlabs.entity.Transaction;
import com.techlabs.exception.CustomerApiException;
import com.techlabs.exception.CustomerNotFoundException;
import com.techlabs.exception.TransactionException;
import com.techlabs.repository.CustomerRepository;
import com.techlabs.repository.TransactionRepository;
import com.techlabs.utils.PagedResponse;
import com.techlabs.utils.TransactionType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TransactionServiceImp implements TransactionService {

    @Autowired
    private final TransactionRepository transactionRepository;
    @Autowired
    private final EmailService emailService;

    @Autowired
    private final CustomerRepository customerRepository;

    public TransactionServiceImp(TransactionRepository transactionRepository, EmailService emailService, CustomerRepository customerRepository) {
        this.transactionRepository = transactionRepository;
        this.emailService = emailService;
        this.customerRepository = customerRepository;
    }

    @Override
    public PagedResponse<TransactionResponseDTO> findAllTransactions(int pageNo, int size, String sort,
                                                                     String sortBy, String sortDirection) {
        checkAdminAccess();
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size,sorting);
        Page<Transaction> pagedTransaction = transactionRepository.findAll(pageable);
        List<Transaction> transactionList = pagedTransaction.getContent();
        List<TransactionResponseDTO> transactionResponseDTOList = transactionsToDTO(transactionList);
        return new PagedResponse<>(transactionResponseDTOList, pagedTransaction.getNumber(),
                pagedTransaction.getSize(), pagedTransaction.getTotalElements(), pagedTransaction.getTotalPages(),
                pagedTransaction.isLast());
    }

    @Override
    public PagedResponse<TransactionResponseDTO> findAllTransactionsByCustomerId(int customerId, int pageNo, int size, String sort,
                                                                                 String sortBy, String sortDirection) {
        checkAccess(customerId);
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size,sorting);
        Page<Transaction> pagedTransaction = transactionRepository.findByCustomerId(customerId,pageable);
        List<Transaction> transactionList = pagedTransaction.getContent();
        List<TransactionResponseDTO> transactionResponseDTOList = transactionsToDTO(transactionList);
        return new PagedResponse<>(transactionResponseDTOList, pagedTransaction.getNumber(),
                pagedTransaction.getSize(), pagedTransaction.getTotalElements(), pagedTransaction.getTotalPages(),
                pagedTransaction.isLast());
    }

    @Override
    public TransferResponseDTO performTransaction(TransactionDTO transactionDTO) {
        int customerId=transactionDTO.getSenderCustomerId();
        checkAccess(customerId);
        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(customerId);
        try {
            if(customer==null){
                throw new CustomerNotFoundException("customer not found");
            }
            boolean isValidBalance = checkBalance(customer, transactionDTO.getTransactionAmount());
            if (!isValidBalance) {
                Transaction transaction = convertDtoToTransaction(transactionDTO, customer, false);
                transactionRepository.save(transaction);
                throw new TransactionException("can't complete transaction");
            }
            System.out.println("transfer amount to another account");
            int receiverAccountNo=transferAmountToReceiverAccount(transactionDTO,customer.getAccountNumber());
            int newBalance=customer.getBalance() - transactionDTO.getTransactionAmount();
            customer.setBalance(newBalance);
            Customer updatedCustomer = customerRepository.save(customer);
            Transaction transaction = convertDtoToTransaction(transactionDTO, updatedCustomer, true);
            transaction=transactionRepository.save(transaction);
            String emailReceiver=customer.getEmail();
            emailService.sendEmailToSender(emailReceiver,receiverAccountNo,transaction.getTransactionAmount(),newBalance);
            return transactionToResponseDTO(transaction, updatedCustomer.getBalance(),true);
        } catch (Exception ignored) {
            if(customer==null){
                throw new CustomerNotFoundException("customer not found");
            }
            Transaction transaction = convertDtoToTransaction(transactionDTO, customer, false);
            Transaction savedTransaction=transactionRepository.save(transaction);
            return transactionToResponseDTO(savedTransaction, customer.getBalance(),false);
        }

    }



    @Override
    public ByteArrayInputStream generateXlsxFile(List<TransactionResponseDTO> transactions) {
        checkAdminAccess();
        try (Workbook workbook = new XSSFWorkbook()) { // Create a new XLSX workbook
            Sheet sheet = workbook.createSheet("Transactions"); // Create a sheet named "Transactions"

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("SenderAccountNo");
            headerRow.createCell(1).setCellValue("ReceiverAccountNo");
            headerRow.createCell(2).setCellValue("Amount");

            headerRow.createCell(3).setCellValue("Date");

            Cell dateCell = headerRow.createCell(3);
            dateCell.setCellValue("Date");
            CellStyle dateCellStyle = workbook.createCellStyle();
            CreationHelper createHelper = workbook.getCreationHelper();
            dateCellStyle.setDataFormat(
                    createHelper.createDataFormat().getFormat("dd/MM/yyyy HH:mm:ss")
            );
            dateCell.setCellStyle(dateCellStyle);

//            headerRow.createCell(4).setCellValue("transactionType");

            // Populate data rows
            int rowNum = 1;
            for (TransactionResponseDTO transaction : transactions) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(transaction.getSenderAccountNo());
                row.createCell(1).setCellValue(transaction.getReceiverAccountNo()); // Assuming getDate returns a suitable format
                row.createCell(2).setCellValue(transaction.getAmount());

                Cell dataDateCell = row.createCell(3);
                dataDateCell.setCellValue(transaction.getTransactionDate());
                dataDateCell.setCellStyle(dateCellStyle);

//                row.createCell(4).setCellValue(transaction.getTransactionType().name());
                // Add more data cells as needed
            }

            // Write workbook to ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);


            // Return ByteArrayInputStream from the outputStream
            return new ByteArrayInputStream(outputStream.toByteArray());
        } catch (IOException e) {
            // Handle exceptions appropriately, e.g., log the error and throw a custom exception
            throw new RuntimeException("Error generating XLSX file", e);
        }
    }

    @Override
    public int allAccountBalances() {
        int customerId=fromToken();
        checkAccess(customerId);
        int identity=customerRepository.findUniqueIdentityByCustomerIdAndIsActive(customerId);
        return customerRepository.findBalancesByUniqueIdentityAndIsActive(identity);
    }

    @Override
    public int accountBalance(int customerId) {
        checkAccess(customerId);
        return customerRepository.findBalanceByCustomerId(customerId);
    }

    @Override
    public PagedResponse<AccountResponseDTO> getMyAllAccounts(int pageNo, int size, String sort,
                                                              String sortBy, String sortDirection) {
        return null;
    }

    private int fromToken() {
        return Integer.parseInt(SecurityContextHolder.getContext().getAuthentication().getName());
    }

    private int transferAmountToReceiverAccount(TransactionDTO transactionDTO,int SenderAccountNo) {
        Customer customer=customerRepository.findByAccountNumberAndIsActiveTrue(transactionDTO.getReceiverAccountNumber());
        if(customer==null){
            throw new CustomerNotFoundException("can not transfer money, because no such account number exist");
        }
        int addedBalance=customer.getBalance()+transactionDTO.getTransactionAmount();
        customer.setBalance(addedBalance);
        customer=customerRepository.save(customer);
        String mailReceiver=customer.getEmail();
        emailService.sendEmailToReceiver(mailReceiver,SenderAccountNo,transactionDTO.getTransactionAmount(), addedBalance);
        return customer.getAccountNumber();
    }

    private TransferResponseDTO transactionToResponseDTO(Transaction transaction, int balance,Boolean statusCode) {
        return new TransferResponseDTO(transaction.getTransactionId(),balance, transaction.getTransactionAmount(),statusCode);
    }

    private Transaction convertDtoToTransaction(TransactionDTO transactionDTO, Customer customer, boolean status) {
        return new Transaction(customer.getAccountNumber(), transactionDTO.getReceiverAccountNumber(),
                transactionDTO.getSenderCustomerId(), LocalDateTime.now(), transactionDTO.getTransactionAmount(),
                status, transactionDTO.getTransactionType());
    }

    private boolean checkBalance(Customer customer, int transactionAmount) {
        if(customer==null){
            throw new CustomerNotFoundException("customer not found");
        }
        if (transactionAmount > customer.getBalance()) {
            System.out.println("less balance ,can't perform transaction");
            return false;

        }
        return true;
    }


    private List<TransactionResponseDTO> transactionsToDTO(List<Transaction> transactionList) {
        List<TransactionResponseDTO> transactionResponseDTOList = new ArrayList<>();
        for (Transaction transaction : transactionList) {
            transactionResponseDTOList.add(convertTransactionToResponseDTO(transaction));
        }
        return transactionResponseDTOList;
    }

    private TransactionResponseDTO convertTransactionToResponseDTO(Transaction transaction) {
        return new TransactionResponseDTO(transaction.getTransactionId(),
                transaction.getSenderAccountNo(), transaction.getReceiverAccountNo(),
                transaction.getTransactionAmount(),transaction.getStatus().toString(), transaction.getTransactionTime());
    }

    private void checkAccess(int customerId){
        String customerLoginId = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean hasUserRole = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_CUSTOMER"));
        if(!customerLoginId.equals(String.valueOf(customerId)) && hasUserRole){
            throw  new ResourceAccessException("you haven't access to this resource, please contact admin");
        }
    }
    private void checkAdminAccess(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean hasUserRole = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_CUSTOMER"));
        if(hasUserRole){
            throw  new ResourceAccessException("you haven't access to this resource, please contact admin");
        }
    }
}
