package com.techlabs.service;

import com.techlabs.dto.CustomerDTO;
import com.techlabs.dto.CustomerResponseDTO;
import com.techlabs.dto.RegisterDTO;
import com.techlabs.entity.*;
import com.techlabs.exception.CustomerNotFoundException;
import com.techlabs.repository.*;
import com.techlabs.utils.AccountType;
import com.techlabs.utils.PagedResponse;
import com.techlabs.utils.RoleType;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AdminServiceImp implements AdminService {
    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImp.class);

    private static final String UPLOAD_DIR = "uploads/";
    private final CustomerRepository customerRepository;
    private final AccountRepository accountRepository;
    private final RegisteredRepository registeredRepository;
    private final AuthRepository authRepository;
    private final InactiveCustomerRepository inactiveCustomerRepository;

    private final EmailService emailService;

    public AdminServiceImp(CustomerRepository customerRepository, AccountRepository
            accountRepository, RegisteredRepository registeredRepository, AuthRepository authRepository,
                           InactiveCustomerRepository inactiveCustomerRepository, EmailService emailService) {
        this.customerRepository = customerRepository;
        this.accountRepository = accountRepository;
        this.registeredRepository = registeredRepository;
        this.authRepository = authRepository;
        this.inactiveCustomerRepository = inactiveCustomerRepository;
        this.emailService = emailService;
    }

    @Override
    public PagedResponse<CustomerResponseDTO> findAllCustomers(int pageNo, int size, String sort,
                                                               String sortBy, String sortDirection) {
        checkAdminAccess();
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Customer> pagedCustomers = customerRepository.findByIsActiveTrue(pageable, true);
        List<Customer> CustomerList = pagedCustomers.getContent();
        List<CustomerResponseDTO> CustomerResponseDTO = customerResponseListToDTO(CustomerList);

        return new PagedResponse<>(CustomerResponseDTO, pagedCustomers.getNumber(),
                pagedCustomers.getSize(), pagedCustomers.getTotalElements(), pagedCustomers.getTotalPages(),
                pagedCustomers.isLast());
    }

    @Override
    public PagedResponse<RegisterDTO> findPendingAccounts(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        checkAdminAccess();
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Registered> pagedCustomers = registeredRepository.findAll(pageable);
        List<Registered> registeredList = pagedCustomers.getContent();
        List<RegisterDTO> CustomerResponseDTO = registeredListToDTO(registeredList);

        return new PagedResponse<>(CustomerResponseDTO, pagedCustomers.getNumber(),
                pagedCustomers.getSize(), pagedCustomers.getTotalElements(), pagedCustomers.getTotalPages(),
                pagedCustomers.isLast());

    }


    private List<RegisterDTO> registeredListToDTO(List<Registered> registeredList) {
        List<RegisterDTO> customerDTOList = new ArrayList<>();
        for (Registered registered : registeredList) {
            customerDTOList.add(convertRegisteredToRegisteredDTO(registered));
        }
        return customerDTOList;
    }

    private RegisterDTO convertRegisteredToRegisteredDTO(Registered registered) {
       return new RegisterDTO(registered.getId(), registered.getFirstName(), registered.getLastName(),
                registered.getNomineeName(), registered.getAddress(), registered.getEmail(),
                registered.getUniqueIdentificationNumber());
    }

    @Override
    public RegisterDTO seeRegisteredUserProfile(int registeredId) {
        checkAdminAccess();
        Registered registeredCustomer = registeredRepository.findById(registeredId).
                orElseThrow(() -> new CustomerNotFoundException("customer with id is not registered yet to bank" + registeredId));
        return convertRegisteredToRegisteredDTO(registeredCustomer);
    }

    @Override
    public CustomerResponseDTO seeInActiveCustomerById(int customerId) {
        Customer customer=customerRepository.findByCustomerIdAndIsActiveFalse(customerId);
        if (customer == null) {
            throw new CustomerNotFoundException("customer is already in-active");
        }
        return inactiveCustomerToCustomerResponseDTO(customer);
    }

    @Override
    public CustomerResponseDTO verifyAndAddAccount(int registeredId) {
        checkAdminAccess();
        Registered registeredCustomer = registeredRepository.findById(registeredId).
                orElseThrow(() -> new CustomerNotFoundException("customer with id is not registered yet to bank" + registeredId));

        Customer customer = addCustomerToAccountTable(registeredCustomer);
//            create account
        Account account = new Account();
        account.setUniqueIdentificationNumber(registeredCustomer.getUniqueIdentificationNumber());
        account.setCustomerId(customer.getCustomerId());
        account = accountRepository.save(account);
        System.out.println("account id of new customer is:" + account.getAccountNumber());

//            save account and set to customer table

        customer.setAccountNumber(account.getAccountNumber());
        customer.setAccountOpenDate(LocalDateTime.now());
        customer.setIdentificationNumber(Integer.parseInt(registeredCustomer.getUniqueIdentificationNumber()));
        customer.setAccountOpenDate(LocalDateTime.now());
        customer.setBalance(1000);
        customer.setFirstName(registeredCustomer.getFirstName());
        customer.setLastName(registeredCustomer.getLastName());
        customer.setNomineeName(registeredCustomer.getNomineeName());
        customer.setCustomerAddress(registeredCustomer.getAddress());
        customer.setEmail(registeredCustomer.getEmail());

        Customer generatedCustomer = customerRepository.save(customer);
        addCustomerCredentials(generatedCustomer);

        registeredRepository.delete(registeredCustomer);
        emailService.sendEmailToCustomer(generatedCustomer);
        return customerResponseToDTO(generatedCustomer);
    }

    private void addCustomerCredentials(Customer generatedCustomer) {
        Credential credential = new Credential();
        credential.setRole(Credential.Role.ROLE_CUSTOMER);
        credential.setCustomerId(generatedCustomer.getCustomerId());
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(String.valueOf(generatedCustomer.getCustomerId()));
        credential.setPassword(String.valueOf(encodedPassword));
        authRepository.save(credential);
    }


//    private void addAdminCredentials(String uniqueIdentificationNumber) {
//        Credential credential = new Credential();
//        credential.setCustomerId(Integer.parseInt(uniqueIdentificationNumber));
//        credential.setRole(RoleType.ROLE_ADMIN);
//        credential.setPassword(uniqueIdentificationNumber);
//        authRepository.save(credential);
//    }

    private Customer addCustomerToAccountTable(Registered registeredCustomer) {
        Customer customer = new Customer();
        customer.setCustomerAddress(registeredCustomer.getAddress());
        customer.setLastName(registeredCustomer.getLastName());
        customer.setFirstName(registeredCustomer.getFirstName());
        customer.setNomineeName(registeredCustomer.getNomineeName());
        customer.setEmail(registeredCustomer.getEmail());
        customer.setActive(true);
        return customer;
    }

//    private CustomerResponseDTO addNewAdmin(Registered registeredAdmin) {
//        String adminCustomerId = registeredAdmin.getUniqueIdentificationNumber();
//        addAdminCredentials(adminCustomerId);
//        return new CustomerResponseDTO(registeredAdmin.getFirstName(), registeredAdmin.getLastName(),
//                registeredAdmin.getRoleType().name(), Integer.parseInt(adminCustomerId));
//    }

    @Override
    public void deleteCustomerRequest(int customerId) {
        checkAdminAccess();

        Customer customer = customerRepository.findById(customerId).orElseThrow(() -> new CustomerNotFoundException("customer not found"));
        if (customer.isActive() == false) {
            throw new CustomerNotFoundException("customer not active,already deactivated");
        }
        customerRepository.deActivateCustomer(customerId);
        Credential credential = authRepository.findByCustomerId(customerId);
        authRepository.delete(credential);
        emailService.sendEmailToCustomerOfAccountInactivated(customer);
    }

    @Override
    public void activateCustomer(int customerId) {
        checkAdminAccess();
        Customer customer1 = customerRepository.findByCustomerIdAndIsActiveFalse(customerId);
        if (customer1 == null) {
            throw new CustomerNotFoundException("customer is already active");
        }
        customerRepository.ActivateCustomer(customerId);
        Customer customer = customerRepository.findByCustomerIdAndIsActiveTrue(customerId);
        addCustomerCredentials(customer);
        emailService.sendEmailToCustomer(customer);
    }

//    private Customer inactiveToActiveCustomer(InactiveCustomer inactiveCustomer) {
//        Customer customer= new Customer(inactiveCustomer.getCustomerId(),inactiveCustomer.getAccountNumber(),inactiveCustomer.getFirstName(),
//                inactiveCustomer.getLastName(),inactiveCustomer.getEmail(),inactiveCustomer.getCustomerAddress(),
//                inactiveCustomer.getNomineeName(),inactiveCustomer.getBalance(),inactiveCustomer.getAccountOpenDate(),inactiveCustomer.getIdentificationNumber());
//        customer.setCustomerId(inactiveCustomer.getCustomerId());
//        return customer;
//    }

    @Override
    public PagedResponse<CustomerResponseDTO> inActiveCustomer(int pageNo, int size, String sort, String sortBy, String sortDirection) {
        checkAdminAccess();
        Sort sorting = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNo, size, sorting);
        Page<Customer> pagedInActiveCustomers = customerRepository.findByIsActiveFalse(pageable);
        List<Customer> inactiveCustomerList = pagedInActiveCustomers.getContent();
        List<CustomerResponseDTO> CustomerResponseDTO = inactiveCustomersToCustomerResponseDTO(inactiveCustomerList);
        return new PagedResponse<>(CustomerResponseDTO, pagedInActiveCustomers.getNumber(),
                pagedInActiveCustomers.getSize(), pagedInActiveCustomers.getTotalElements(), pagedInActiveCustomers.getTotalPages(),
                pagedInActiveCustomers.isLast());
    }

    @Override
    public void deleteRegisteredRequest(int registeredId) {
        registeredRepository.deleteById(registeredId);
    }

    @Override
    public Resource downloadUserAadhar(int registeredId) {
        checkAdminAccess();
        Registered registeredUser = registeredRepository.findById(registeredId).
                orElseThrow(() -> new NoSuchElementException("registered user not found"));
        String filename = registeredUser.getUniqueIdentificationNumber()+registeredUser.getDocExtension();
        Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
        try {
            return new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
    }



    private List<CustomerResponseDTO> inactiveCustomersToCustomerResponseDTO(List<Customer> inactiveCustomerList) {
        List<CustomerResponseDTO> customerResponseDTOList = new ArrayList<>();
        for (Customer inactiveCustomer : inactiveCustomerList) {
            customerResponseDTOList.add(inactiveCustomerToCustomerResponseDTO(inactiveCustomer));
        }
        return customerResponseDTOList;
    }

    private CustomerResponseDTO inactiveCustomerToCustomerResponseDTO(Customer inactiveCustomer) {
        return new CustomerResponseDTO(inactiveCustomer.getFirstName(), inactiveCustomer.getLastName(),
                inactiveCustomer.getAccountNumber(), inactiveCustomer.getBalance(), inactiveCustomer.getCustomerId());
    }

//    private void addCustomerToInactive(int customerId) {
//        Customer customer = customerRepository.findById(customerId).
//                orElseThrow(() -> new CustomerNotFoundException("customer with id was not found, so can't convert to inactive"+customerId));
//        if(customer==null){
//            logger.info("there is no such customer found with id:"+customerId);
//            throw new CustomerNotFoundException("customer not found, can't convert to inactive");
//        }
//        InactiveCustomer inactiveCustomer = convertCustomerToInactiveCustomer(customer);
//        inactiveCustomerRepository.save(inactiveCustomer);
//        emailService.sendEmailToCustomerOfAccountInactivated(customer);
//    }

    private InactiveCustomer convertCustomerToInactiveCustomer(Customer customer) {
        return new InactiveCustomer(customer.getCustomerId(), customer.getAccountNumber(),
                customer.getFirstName(), customer.getLastName(), customer.getEmail(),
                customer.getCustomerAddress(), customer.getNomineeName(), customer.getBalance(),
                customer.getAccountOpenDate(), customer.getIdentificationNumber());
    }

    private CustomerResponseDTO customerResponseToDTO(Customer customer) {
        return new CustomerResponseDTO(customer.getFirstName(), customer.getLastName(),
                customer.getAccountNumber(), customer.getBalance(), customer.getCustomerId());
    }

    private List<CustomerDTO> customerListToDTO(List<Customer> customerList) {
        List<CustomerDTO> customerResponseDTOList = new ArrayList<>();
        for (Customer customer : customerList) {
            customerResponseDTOList.add(new CustomerDTO(customer.getFirstName(), customer.getLastName(),
                    customer.getNomineeName(), customer.getCustomerAddress()));
        }
        return customerResponseDTOList;
    }

    private List<CustomerResponseDTO> customerResponseListToDTO(List<Customer> customerList) {
        List<CustomerResponseDTO> customerResponseDTOList = new ArrayList<>();
        for (Customer customer : customerList) {
            customerResponseDTOList.add(customerResponseToDTO(customer));
        }
        return customerResponseDTOList;
    }

    private void checkAdminAccess() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean hasUserRole = authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_CUSTOMER"));
        if (hasUserRole) {
            throw new ResourceAccessException("you haven't access to this resource, please contact admin");
        }
    }
}
