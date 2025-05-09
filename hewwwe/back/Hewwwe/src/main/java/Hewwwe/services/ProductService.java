package Hewwwe.services;

import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.dto.UserResponseDTO;
import Hewwwe.entity.Product;

import java.util.List;

public interface ProductService {
    List<ProductResponseDTO> findAll();
    ProductResponseDTO findById(Long id);
    Product getEntityById(Long id);
    ProductResponseDTO save(Product product);
    ProductResponseDTO update(Long id, Product product);
    void delete(Long id);
    List<ProductResponseDTO> findByCategory(Long categoryId);
    List<ProductResponseDTO> findByUser(Long userId);
    List<ProductResponseDTO> findByStatus(String status);
    List<ProductResponseDTO> searchProducts(String keyword);
    UserResponseDTO findUserByProductId(Long productId);
    boolean existsById(Long id);
}
