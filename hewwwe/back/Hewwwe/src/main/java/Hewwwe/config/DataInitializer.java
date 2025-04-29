package Hewwwe.config;

import Hewwwe.entity.*;
import Hewwwe.entity.enums.Rol;
import Hewwwe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CategoryRepository categoryRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final InvoiceRepository invoiceRepository;
    private final ExchangeRepository exchangeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Skip if data exists
        }

        // Create users
        User alice = createUser("Alice", "alice123", "user123", "alice@example.com", "600111111", Rol.USER);
        User bob = createUser("Bob", "bob456", "admin123", "bob@example.com", "600222222", Rol.ADMIN);
        User carla = createUser("Carla", "carla789", "user123", "carla@example.com", "600333333", Rol.USER);
        User daniel = createUser("Daniel", "daniel012", "user123", "daniel@example.com", "600444444", Rol.USER);
        User eva = createUser("Eva", "eva345", "user123", "eva@example.com", "600555555", Rol.USER);

        // Create addresses
        Address address1 = createAddress(alice, "Madrid", "España", "10", "28001", "Gran Via");
        Address address2 = createAddress(bob, "Barcelona", "España", "20", "08001", "Diagonal");
        Address address3 = createAddress(carla, "Sevilla", "España", "30", "41001", "Alameda");
        Address address4 = createAddress(daniel, "Valencia", "España", "40", "46001", "Colon");
        Address address5 = createAddress(eva, "Bilbao", "España", "50", "48001", "Indautxu");

        // Create categories
        Category electronica = createCategory("Electrónica", "Electrónica y gadgets");
        Category moda = createCategory("Moda", "Ropa y moda");
        Category hogar = createCategory("Hogar", "Hogar y decoración");

        // Create carts
        Cart cart1 = createCart(alice);
        Cart cart2 = createCart(bob);
        Cart cart3 = createCart(carla);
        Cart cart4 = createCart(daniel);
        Cart cart5 = createCart(eva);

        // Create invoices
        Invoice invoice1 = createInvoice(alice, address1, 150.50);
        Invoice invoice2 = createInvoice(bob, address2, 89.99);
        Invoice invoice3 = createInvoice(carla, address3, 42.00);

        // Create exchanges
        Exchange exchange1 = createExchange(alice, bob, "COMPLETED");
        Exchange exchange2 = createExchange(bob, carla, "PENDING");
        Exchange exchange3 = createExchange(daniel, eva, "PENDING");

        // Create products
        createProduct("T-Shirt", "Camiseta negra", 19.99, "L", "img2.jpg", "SOLD", cart2, moda, exchange1, invoice1, bob);
        createProduct("Nike Air", "Zapatillas deportivas", 75.00, "42", "img5.jpg", "AVAILABLE", cart2, moda, null, null, bob);
        // ... add more products as needed
    }

    private User createUser(String name, String username, String password, String email, String phone, Rol role) {
        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setPhone(phone);
        user.setRole(role);
        user.setActive(true);
        user.setRegistrationDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        return userRepository.save(user);
    }

    private Address createAddress(User user, String city, String country, String number, String postalCode, String street) {
        Address address = new Address();        address.setCity(city);
        address.setCountry(country);
        address.setNumber(number);
        address.setPostalCode(postalCode);
        address.setStreet(street);
        address.setUser(user);
        return addressRepository.save(address);
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        return categoryRepository.save(category);
    }

    private Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setCartDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    private Invoice createInvoice(User user, Address address, double totalAmount) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        invoice.setTotalAmount(totalAmount);
        invoice.setUser(user);
        invoice.setAddress(address);
        return invoiceRepository.save(invoice);
    }

    private Exchange createExchange(User owner, User requester, String status) {
        Exchange exchange = new Exchange();
        exchange.setExchangeDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        exchange.setStatus(status);
        exchange.setOwner(owner);
        exchange.setRequester(requester);
        if (status.equals("COMPLETED")) {
            exchange.setCompletionDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        }
        return exchangeRepository.save(exchange);
    }

    private Product createProduct(String name, String description, double price, String size, 
            String image, String status, Cart cart, Category category, Exchange exchange, 
            Invoice invoice, User user) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setSize(size);
        product.setImage(image);
        product.setStatus(status);
        product.setPublicationDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        product.setCart(cart);
        product.setCategory(category);
        product.setExchange(exchange);
        product.setInvoice(invoice);
        product.setUser(user);
        return productRepository.save(product);
    }
}
