package Hewwwe.services;

import Hewwwe.dto.AddressResponseDTO;
import Hewwwe.dto.CartResponseDTO;
import Hewwwe.dto.ExchangeResponseDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import Hewwwe.entity.enums.Rol;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findByIdWithAddressesAndProducts(id);
    }

    @Override
    public User save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRegistrationDate(new Date());
        return userRepository.save(user);
    }

    @Override
    public User update(Long id, User user) {
        return userRepository.findById(id)
            .map(existingUser -> {
                existingUser.setName(user.getName());
                existingUser.setEmail(user.getEmail());
                existingUser.setPhone(user.getPhone());
                existingUser.setUsername(user.getUsername());
                existingUser.setRole(Rol.USER);
                
                if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
                }
                
                return userRepository.save(existingUser);
            }).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public CartResponseDTO getCartByUserId(Long userId) {
        return userRepository.findById(userId).map(user -> {
            Cart cart = user.getCart();
            if (cart == null) return null;

            List<Long> productIds = cart.getProducts().stream()
                    .map(Product::getProductId)
                    .collect(Collectors.toList());

            return new CartResponseDTO(
                    cart.getCartId(),
                    cart.getCartDate(),
                    user.getUserId(),
                    productIds
            );
        }).orElse(null);
    }


    public List<AddressResponseDTO> getAddressesByUserId(Long userId) {
        return userRepository.findById(userId).map(user ->
                user.getAddresses().stream().map(address ->
                        new AddressResponseDTO(
                                address.getAddressId(),
                                address.getStreet(),
                                address.getNumber(),
                                address.getCity(),
                                address.getCountry(),
                                address.getPostalCode(),
                                user.getUserId(),
                                user.getName()
                        )
                ).collect(Collectors.toList())
        ).orElse(List.of());
    }


    public List<ProductResponseDTO> getProductsByUserId(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getProducts().stream().map(product -> {
                    ProductResponseDTO dto = new ProductResponseDTO();
                    dto.setProductId(product.getProductId());
                    dto.setName(product.getName());
                    dto.setDescription(product.getDescription());
                    dto.setPrice(product.getPrice());
                    dto.setImage(product.getImage());
                    dto.setSize(product.getSize());
                    dto.setStatus(product.getStatus());
                    dto.setPublicationDate(product.getPublicationDate());

                    // Cargar IDs de relaciones sin devolver entidades
                    dto.setUserId(product.getUser().getUserId());
                    dto.setCategoryId(product.getCategory() != null ? product.getCategory().getCategoryId() : null);
                    dto.setCartId(product.getCart() != null ? product.getCart().getCartId() : null);
                    dto.setExchangeId(product.getExchange() != null ? product.getExchange().getExchangeId() : null);

                    return dto;
                }).collect(Collectors.toList()))
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }


    public List<ExchangeResponseDTO> getExchangesByUserId(Long userId) {
        return userRepository.findById(userId).map(user -> {
            List<Exchange> allExchanges = new ArrayList<>();
            allExchanges.addAll(user.getRequestedExchanges());
            allExchanges.addAll(user.getOwnedExchanges());
    
            return allExchanges.stream().map(exchange -> {
                ExchangeResponseDTO dto = new ExchangeResponseDTO();
                dto.setExchangeId(exchange.getExchangeId());
                dto.setExchangeDate(exchange.getExchangeDate());
                dto.setCompletionDate(exchange.getCompletionDate());
    
                // Usuarios
                if (exchange.getRequester() != null) {
                    dto.setRequesterId(exchange.getRequester().getUserId());
                    dto.setRequesterName(exchange.getRequester().getName()); 
                }
                if (exchange.getOwner() != null) {
                    dto.setOwnerId(exchange.getOwner().getUserId());
                    dto.setOwnerName(exchange.getOwner().getName()); 
                }
    
                // Productos
                List<Long> productIds = new ArrayList<>();
                List<String> productNames = new ArrayList<>();
                for (Product p : exchange.getProducts()) {
                    productIds.add(p.getProductId());
                    productNames.add(p.getName()); 
                }
                dto.setProductIds(productIds);
    
                return dto;
            }).collect(Collectors.toList());
        }).orElse(List.of());
    }


    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
