package Hewwwe.config;

import Hewwwe.entity.*;
import Hewwwe.entity.enums.Rol;
import Hewwwe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

        // Create products first
        Product tshirt = createProduct("T-Shirt", "Camiseta negra", 19.99, "L", "img2.jpg", "AVAILABLE", null, moda, null, null, alice);
        Product nikeAir = createProduct("Nike Air", "Zapatillas deportivas", 75.00, "42", "img5.jpg", "AVAILABLE", null, moda, null, null, carla);
        Product jeans = createProduct("Jeans Slim", "Vaqueros azules ajustados", 45.99, "M", "jeans1.jpg", "AVAILABLE", null, moda, null, null, alice);
        Product adidas = createProduct("Adidas Boost", "Zapatillas running", 89.99, "43", "boost.jpg", "AVAILABLE", null, moda, null, null, carla);
        Product camisa = createProduct("Camisa Oxford", "Camisa blanca formal", 35.00, "L", "shirt1.jpg", "AVAILABLE", null, moda, null, null, daniel);
        Product vestido = createProduct("Vestido Floral", "Vestido verano estampado", 55.50, "S", "dress1.jpg", "AVAILABLE", null, moda, null, null, eva);
        Product chaqueta = createProduct("Chaqueta Cuero", "Chaqueta negra motero", 120.00, "M", "jacket1.jpg", "AVAILABLE", null, moda, null, null, alice);
        Product vans = createProduct("Vans Old School", "Zapatillas skate", 70.00, "44", "vans.jpg", "AVAILABLE", null, moda, null, null, daniel);
        Product sudadera = createProduct("Sudadera Hood", "Sudadera gris con capucha", 42.99, "XL", "hoodie1.jpg", "AVAILABLE", null, moda, null, null, carla);
        Product falda = createProduct("Falda Plisada", "Falda midi plisada", 38.50, "M", "skirt1.jpg", "AVAILABLE", null, moda, null, null, eva);
        Product pantalon = createProduct("Pantalón Cargo", "Pantalón militar verde", 49.99, "L", "pants1.jpg", "AVAILABLE", null, moda, null, null, daniel);
        Product blazer = createProduct("Blazer Classic", "Blazer negro formal", 89.99, "M", "blazer1.jpg", "AVAILABLE", null, moda, null, null, alice);
        Product jersey = createProduct("Jersey Lana", "Jersey cuello alto", 59.99, "L", "sweater1.jpg", "AVAILABLE", null, moda, null, null, eva);
        Product chino = createProduct("Pantalón Chino", "Pantalón beige casual", 45.00, "M", "chinos1.jpg", "AVAILABLE", null, moda, null, null, carla);

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
        Address address = new Address();        
        address.setCity(city);
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

    private Exchange createExchange(User owner, User requester, String status, List<Product> products) {
        Exchange exchange = new Exchange();
        exchange.setExchangeDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        exchange.setStatus(status);
        exchange.setOwner(owner);
        exchange.setRequester(requester);
        if (status.equals("COMPLETED")) {
            exchange.setCompletionDate(java.util.Date.from(LocalDateTime.now().atZone(java.time.ZoneId.systemDefault()).toInstant()));
        }
        
        // Save the exchange first so it has an ID
        Exchange savedExchange = exchangeRepository.save(exchange);
        
        // Now assign products to exchange
        if (products != null && !products.isEmpty()) {
            savedExchange.setProducts(new ArrayList<>(products));
            
            // Update the bidirectional relationship
            for (Product product : products) {
                if (product.getExchanges() == null) {
                    product.setExchanges(new ArrayList<>());
                }
                product.getExchanges().add(savedExchange);
                productRepository.save(product);
            }
            
            // Save the exchange with the products
            savedExchange = exchangeRepository.save(savedExchange);
        }
        
        return savedExchange;
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
        product.setInvoice(invoice);
        product.setUser(user);
        product.setExchanges(new ArrayList<>());
        
        return productRepository.save(product);
    }
}
