package Hewwwe.services;

import Hewwwe.entity.Cart;
import Hewwwe.entity.Category;
import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import Hewwwe.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository;

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
        return productRepository.save(product);
    }

    @Override
    public Product update(Long id, Product product) {
        return productRepository.findById(id).map(existingProduct -> {
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setImage(product.getImage());
            existingProduct.setSize(product.getSize());
            existingProduct.setStatus(product.getStatus());
            existingProduct.setPublicationDate(product.getPublicationDate());

            // Relaciones
            existingProduct.setUser(product.getUser());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setCart(product.getCart());
            existingProduct.setExchange(product.getExchange());

            return productRepository.save(existingProduct);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> findByUser(User user) {
        return productRepository.findByUser(user);
    }

    public List<Product> findByCategory(Category category) {
        return productRepository.findByCategory(category);
    }

    public List<Product> findByCart(Cart cart) {
        return productRepository.findByCart(cart);
    }

    public List<Product> findByExchange(Exchange exchange) {
        return productRepository.findByExchange(exchange);
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
