package Hewwwe.services;

import Hewwwe.entity.Cart;
import Hewwwe.entity.Category;
import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface ProductService {
    List<Product> findAll();
    Optional<Product> findById(Long id);
    Product save(Product product);
    Product update(Long id, Product product);
    List<Product> findByUser(User user);
    List<Product> findByCategory(Category category);
    List<Product> findByCart(Cart cart);
    List<Product> findByExchange(Exchange exchange);
    void delete(Long id);
}
