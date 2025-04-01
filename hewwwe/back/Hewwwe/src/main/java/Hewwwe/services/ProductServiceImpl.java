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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

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
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public Product save(Product product) {
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

        return productRepository.save(product);
    }

    @Override
    public Product update(Long id, Product product) {
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

                    return productRepository.save(existingProduct);
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
    public List<Product> findByCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(productRepository::findByCategory)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    @Override
    public List<Product> findByUser(Long userId) {
        return userRepository.findById(userId)
                .map(productRepository::findByUser)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Override
    public List<Product> findByStatus(String status) {
        return productRepository.findByStatus(status);
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    @Override
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }
}
