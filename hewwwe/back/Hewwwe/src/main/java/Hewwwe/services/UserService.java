package Hewwwe.services;

import Hewwwe.entity.Address;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface UserService {
    List<User> findAll();
    Optional<User> findById(Long id);
    User save(User user);
    User update(Long id, User user);
    Cart getCartByUserId(Long userId);
    List<Address> getAddressesByUserId(Long userId);
    List<Product> getProductsByUserId(Long userId);
    List<Exchange> getExchangesByUserId(Long userId);
    void delete(Long id);
}
