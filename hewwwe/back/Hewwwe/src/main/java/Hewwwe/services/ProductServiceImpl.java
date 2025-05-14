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
import Hewwwe.dto.ProductCreateDTO;
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
                .filter(product -> "AVAILABLE".equals(product.getStatus()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ProductResponseDTO> findAllForAdmin() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductResponseDTO save(ProductCreateDTO productDTO) {

        Product product = Product.builder()
        .name(productDTO.getName())
        .description(productDTO.getDescription())
        .price(productDTO.getPrice())
        .image(productDTO.getImage())
        .size(productDTO.getSize())
        .status(productDTO.getStatus())
        .publicationDate(productDTO.getPublicationDate())
        .build();

        // Validate and set User
        User user = userRepository.findById(productDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        product.setUser(user);

        // Validate and set Category
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        product.setCategory(category);

        // Set Cart if present
        if (productDTO.getCartId() != null) {
            Cart cart = cartRepository.findById(productDTO.getCartId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
            product.setCart(cart);
        }

        // Set Exchange if present
        if (productDTO.getExchangeId() != null) {
            Exchange exchange = exchangeRepository.findById(productDTO.getExchangeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));
            product.setExchange(exchange);
        }

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    @Override
    public ProductResponseDTO save(Product product) {
        // Verificar que el producto no es nulo y que tiene un ID válido
        if (product == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }
        
        if (product.getProductId() == null) {
            throw new IllegalArgumentException("Product ID cannot be null");
        }
        
        // Verificar que el producto existe en la base de datos
        Product existingProduct = productRepository.findById(product.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + product.getProductId()));
        
        // Si solo estamos actualizando el estado, usar el método update en lugar de crear un nuevo DTO
        if (product.getStatus() != null && !product.getStatus().equals(existingProduct.getStatus())) {
            existingProduct.setStatus(product.getStatus());
            Product savedProduct = productRepository.save(existingProduct);
            return mapToDTO(savedProduct);
        }
        
        // Si necesitamos una actualización completa, construir el DTO con todos los campos requeridos
        var dto = ProductCreateDTO.builder()
            .name(product.getName() != null ? product.getName() : existingProduct.getName())
            .description(product.getDescription() != null ? product.getDescription() : existingProduct.getDescription())
            .price(product.getPrice() != null ? product.getPrice() : existingProduct.getPrice())
            .image(product.getImage() != null ? product.getImage() : existingProduct.getImage())
            .size(product.getSize() != null ? product.getSize() : existingProduct.getSize())
            .status(product.getStatus() != null ? product.getStatus() : existingProduct.getStatus())
            .publicationDate(product.getPublicationDate() != null ? product.getPublicationDate() : existingProduct.getPublicationDate())
            .userId(product.getUser() != null && product.getUser().getUserId() != null ? 
                   product.getUser().getUserId() : existingProduct.getUser().getUserId())
            .categoryId(product.getCategory() != null && product.getCategory().getCategoryId() != null ? 
                       product.getCategory().getCategoryId() : existingProduct.getCategory().getCategoryId())
            .build();
        
        // Copiar IDs opcionales si están presentes
        if (product.getCart() != null && product.getCart().getCartId() != null) {
            dto.setCartId(product.getCart().getCartId());
        } else if (existingProduct.getCart() != null) {
            dto.setCartId(existingProduct.getCart().getCartId());
        }
        
        if (product.getExchange() != null && product.getExchange().getExchangeId() != null) {
            dto.setExchangeId(product.getExchange().getExchangeId());
        } else if (existingProduct.getExchange() != null) {
            dto.setExchangeId(existingProduct.getExchange().getExchangeId());
        }
        
        return save(dto);
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

    @Override
    public Product getEntityById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}
