package Hewwwe.services;

import Hewwwe.entity.Address;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Product;

public interface CartService {
    void checkoutCart(Long cartId, Address shippingAddress);
    Cart findById(Long id);
    Cart save(Cart cart);
    Cart update(Long id, Cart cart);
    void delete(Long id);
    void addProduct(Long cartId, Product product);
    void removeProduct(Long cartId, Long productId);
    void clearCart(Long cartId);
    Double calculateTotal(Long cartId);
}
