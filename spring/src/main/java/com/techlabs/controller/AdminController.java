package com.techlabs.controller;

import com.techlabs.dto.CustomerDTO;
import com.techlabs.dto.CustomerResponseDTO;
import com.techlabs.dto.RegisterDTO;
import com.techlabs.dto.TransactionResponseDTO;
import com.techlabs.service.AdminService;
import com.techlabs.service.CustomerService;
import com.techlabs.service.TransactionService;
import com.techlabs.utils.PagedResponse;
import jakarta.validation.Valid;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final TransactionService transactionService;
    private final CustomerService customerService;

    public AdminController(AdminService adminService, TransactionService transactionService, CustomerService customerService) {
        this.adminService = adminService;
        this.transactionService = transactionService;
        this.customerService = customerService;
    }

    @GetMapping("/transactions")
    ResponseEntity<PagedResponse<TransactionResponseDTO>> allTransactions(@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
                                                                          @RequestParam(name = "size", defaultValue = "10") int size,
                                                                          @RequestParam(name = "sort", defaultValue = "ASC") String sort,
                                                                          @RequestParam(name = "sortBy", defaultValue = "transactionTime") String sortBy,
                                                                          @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<TransactionResponseDTO> transactions = transactionService.findAllTransactions(pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/transactions/{id}")
    ResponseEntity<PagedResponse<TransactionResponseDTO>> transactionById(@PathVariable("id") int customerId,
                                                                          @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
                                                                          @RequestParam(name = "size", defaultValue = "10") int size,
                                                                          @RequestParam(name = "sort", defaultValue = "ASC") String sort,
                                                                          @RequestParam(name = "sortBy", defaultValue = "transactionTime") String sortBy,
                                                                          @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<TransactionResponseDTO> transactions = transactionService.findAllTransactionsByCustomerId(customerId, pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/download-transactions")
    public ResponseEntity<Resource> downloadTransactions(@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
                                                         @RequestParam(name = "size", defaultValue = "10") int size,
                                                         @RequestParam(name = "sort", defaultValue = "ASC") String sort,
                                                         @RequestParam(name = "sortBy", defaultValue = "transactionTime") String sortBy,
                                                         @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<TransactionResponseDTO> transactions = transactionService.findAllTransactions(pageNo, size, sort, sortBy, sortDirection); // Fetch data
        List<TransactionResponseDTO> transactionResponseDTOList = transactions.getPagedData();
        // Generate file (using your file generation service/helper)
        ByteArrayInputStream fileInputStream = transactionService.generateXlsxFile(transactionResponseDTOList);

        // Prepare response
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=transactions.xlsx");
        headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        return ResponseEntity.ok()
                .headers(headers)
                .body(new InputStreamResource(fileInputStream));
    }


    @GetMapping("/customers")
    ResponseEntity<PagedResponse<CustomerResponseDTO>> allCustomers(
            @RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<CustomerResponseDTO> transactions = adminService.findAllCustomers(pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/customers/{id}")
    ResponseEntity<CustomerResponseDTO> customerById(@PathVariable("id") int customerId) {
        CustomerResponseDTO customerResponseDTO = customerService.findCustomerById(customerId);
        return new ResponseEntity<>(customerResponseDTO, HttpStatus.OK);
    }

    @GetMapping("/download-aadhar/{id}")
    ResponseEntity<Resource> downloadFile(@PathVariable("id") int registeredId) {
        Resource resource = adminService.downloadUserAadhar(registeredId);
        // Determine content type using the file path
        String contentType;
        try {
            contentType = Files.probeContentType(Paths.get(resource.getFile().getAbsolutePath()));
            if (contentType == null) {
                // Fallback to binary type if unable to determine
                contentType = "application/octet-stream";
            }
        } catch (IOException e) {
            // Log the error and default to binary type
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/customer/auth/{id}")
    ResponseEntity<HttpStatus> updatedCustomerPassword(@PathVariable("id") int customerId, @RequestBody String password) {
        customerService.updatedCustomerPassword(customerId, password);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/customers/{id}")
    ResponseEntity<CustomerResponseDTO> updateCustomer(@PathVariable("id") int customerId,
                                                       @Valid @RequestBody CustomerDTO customerDTO
    ) {
        CustomerResponseDTO customerResponseDTO = customerService.updateCustomerById(customerId, customerDTO);
        return new ResponseEntity<>(customerResponseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/customers/{id}")
    ResponseEntity<HttpStatus> deleteCustomerById(@PathVariable("id") int customerId) {
        adminService.deleteCustomerRequest(customerId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/pending-accounts")
    ResponseEntity<PagedResponse<RegisterDTO>> pendingAccounts(@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
                                                               @RequestParam(name = "size", defaultValue = "10") int size,
                                                               @RequestParam(name = "sort", defaultValue = "ASC") String sort,
                                                               @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
                                                               @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<RegisterDTO> accountsInReview = adminService.findPendingAccounts(pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(accountsInReview, HttpStatus.OK);
    }

    @PostMapping("/pending-accounts/{id}")
    ResponseEntity<CustomerResponseDTO> verifyAndAddAccount(@PathVariable("id") int registeredId) {
        CustomerResponseDTO customerResponseDTO = adminService.verifyAndAddAccount(registeredId);
        return new ResponseEntity<>(customerResponseDTO, HttpStatus.OK);
    }
    @GetMapping("/pending-account/{id}")
    ResponseEntity<RegisterDTO> seeRegisteredUserProfile(@PathVariable("id") int registeredId) {
        RegisterDTO customerResponseDTO = adminService.seeRegisteredUserProfile(registeredId);
        return new ResponseEntity<>(customerResponseDTO, HttpStatus.OK);
    }

    @DeleteMapping("/pending-accounts/{id}")
    ResponseEntity<HttpStatus> deleteCustomerRequest(@PathVariable("id") int customerId) {
        adminService.deleteRegisteredRequest(customerId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/activate-customer/{cid}")
    ResponseEntity<HttpStatus> activateCustomer(@PathVariable("cid") int customerId) {
        System.out.println("activeate customers is"+customerId);
        adminService.activateCustomer(customerId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/inactive-customers")
    ResponseEntity<PagedResponse<CustomerResponseDTO>> seeInActiveCustomers(@RequestParam(name = "pageNo", defaultValue = "0") int pageNo,
                                                                            @RequestParam(name = "size", defaultValue = "10") int size,
                                                                            @RequestParam(name = "sort", defaultValue = "ASC") String sort,
                                                                            @RequestParam(name = "sortBy", defaultValue = "firstName") String sortBy,
                                                                            @RequestParam(name = "sortDirection", defaultValue = "ASC") String sortDirection) {
        PagedResponse<CustomerResponseDTO> inActiveCustomers = adminService.inActiveCustomer(pageNo, size, sort, sortBy, sortDirection);
        return new ResponseEntity<>(inActiveCustomers, HttpStatus.OK);
    }
    @GetMapping("/inactive-customer/{cid}")
    ResponseEntity<CustomerResponseDTO> seeInActiveCustomerById(@PathVariable("cid")int customerId) {
        CustomerResponseDTO inActiveCustomers = adminService.seeInActiveCustomerById(customerId);
        return new ResponseEntity<>(inActiveCustomers, HttpStatus.OK);
    }

}
