package Hewwwe.services;

import Hewwwe.entity.Cart;
import Hewwwe.entity.Category;
import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.repository.CartRepository;
import Hewwwe.repository.CategoryRepository;
import Hewwwe.repository.ExchangeRepository;
import Hewwwe.repository.ProductRepository;
import Hewwwe.repository.UserRepository;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.dto.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ExchangeRepository exchangeRepository;

    @Override
    public List<ProductResponseDTO> findAll() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO save(Product product) {
        // Validate and set User
        User user = userRepository.findById(product.getUser().getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        product.setUser(user);

        // Validate and set Category
        Category category = categoryRepository.findById(product.getCategory().getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        product.setCategory(category);

        // Set Cart if present
        if (product.getCart() != null && product.getCart().getCartId() != null) {
            Cart cart = cartRepository.findById(product.getCart().getCartId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
            product.setCart(cart);
        }

        // Set Exchange if present
        if (product.getExchange() != null && product.getExchange().getExchangeId() != null) {
            Exchange exchange = exchangeRepository.findById(product.getExchange().getExchangeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));
            product.setExchange(exchange);
        }

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    @Override
    public ProductResponseDTO update(Long id, Product product) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    // Update basic fields
                    existingProduct.setName(product.getName());
                    existingProduct.setDescription(product.getDescription());
                    existingProduct.setPrice(product.getPrice());
                    existingProduct.setImage(product.getImage());
                    existingProduct.setSize(product.getSize());
                    existingProduct.setStatus(product.getStatus());
                    existingProduct.setPublicationDate(product.getPublicationDate());

                    // Update relationships if provided
                    if (product.getCategory() != null && product.getCategory().getCategoryId() != null) {
                        Category category = categoryRepository.findById(product.getCategory().getCategoryId())
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
                        existingProduct.setCategory(category);
                    }

                    if (product.getCart() != null && product.getCart().getCartId() != null) {
                        Cart cart = cartRepository.findById(product.getCart().getCartId())
                                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
                        existingProduct.setCart(cart);
                    }

                    if (product.getExchange() != null && product.getExchange().getExchangeId() != null) {
                        Exchange exchange = exchangeRepository.findById(product.getExchange().getExchangeId())
                                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));
                        existingProduct.setExchange(exchange);
                    }

                    Product updatedProduct = productRepository.save(existingProduct);
                    return mapToDTO(updatedProduct);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductResponseDTO> findByCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(category -> productRepository.findByCategory(category).stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    @Override
    public List<ProductResponseDTO> findByUser(Long userId) {
        return userRepository.findById(userId)
                .map(user -> productRepository.findByUser(user).stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public List<ProductResponseDTO> findByStatus(String status) {
        return productRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductResponseDTO> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    private ProductResponseDTO mapToDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setProductId(product.getProductId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImage(product.getImage());
        dto.setSize(product.getSize());
        dto.setStatus(product.getStatus());
        dto.setPublicationDate(product.getPublicationDate());

        // Mapear información del usuario
        if (product.getUser() != null) {
            dto.setUserId(product.getUser().getUserId());
            dto.setUserName(product.getUser().getName());
            dto.setUserEmail(product.getUser().getEmail());
        }

        // Mapear información de la categoría
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
            dto.setCategoryName(product.getCategory().getName());
        }

        // Mapear IDs opcionales
        if (product.getCart() != null) {
            dto.setCartId(product.getCart().getCartId());
        }
        if (product.getExchange() != null) {
            dto.setExchangeId(product.getExchange().getExchangeId());
        }

        return dto;
    }

    @Override
    public ProductResponseDTO findById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    @Override
    public UserResponseDTO findUserByProductId(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        User user = product.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("User not found for product: " + productId);
        }

        UserResponseDTO userDTO = new UserResponseDTO();
        userDTO.setUserId(user.getUserId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setRole(user.getRole().toString());
        userDTO.setRegistrationDate(user.getRegistrationDate());
        
        return userDTO;
    }
}
