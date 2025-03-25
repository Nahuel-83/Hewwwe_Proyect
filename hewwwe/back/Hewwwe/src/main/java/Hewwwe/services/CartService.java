package Hewwwe.services;

import Hewwwe.entity.Cart;
import Hewwwe.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CartService {
    Cart saveCart(Cart cart);
    Cart getCartById(Long id);
    List<Cart> getAllCarts();
    void deleteCartById(Long id);
    Cart updateCart(Cart cart);
    Cart addProductToCart(Long cartId, Product product);
    Cart removeProductFromCart(Long cartId, Long productId);
}
