package Hewwwe.services;

import Hewwwe.entity.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> findAll();
    Optional<Product> findById(Long id);
    Product save(Product product);
    Product update(Long id, Product product);
    void delete(Long id);
    List<Product> findByCategory(Long categoryId);
    List<Product> findByUser(Long userId);
    List<Product> findByStatus(String status);
    List<Product> searchProducts(String keyword);
    boolean existsById(Long id);
}
