package Hewwwe.services;

import Hewwwe.entity.Cart;
import Hewwwe.entity.Product;
import Hewwwe.repository.CartRepository;
import Hewwwe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;


    @Override
    public Cart saveCart(Cart cart) {
        if (!userRepository.existsById(cart.getUser().getUserId())) {
            throw new IllegalArgumentException("User with ID " + cart.getUser().getUserId() + " does not exist.");
        }

        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartById(Long id) {
        return cartRepository.findById(id).orElse(null);
    }

    @Override
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @Override
    public void deleteCartById(Long id) {
        cartRepository.deleteById(id);
    }

    @Override
    public Cart updateCart(Cart cart) {
        if (!userRepository.existsById(cart.getUser().getUserId())) {
            throw new IllegalArgumentException("User with ID " + cart.getUser().getUserId() + " does not exist.");
        }
        return cartRepository.save(cart);
    }

    public Cart addProductToCart(Long cartId, Product product) {
        Cart cart = getCartById(cartId); // Validamos que el carrito exista

        // Establecemos la relación bidireccional
        product.setCart(cart);
        cart.getProducts().add(product);

        return cartRepository.save(cart);
    }
    public Cart removeProductFromCart(Long cartId, Long productId) {
        Cart cart = getCartById(cartId); // Validamos que el carrito exista
        Product productToRemove = cart.getProducts()
                .stream()
                .filter(product -> product.getProductId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Product not found in the cart"));

        // Eliminamos el producto de la lista
        cart.getProducts().remove(productToRemove);

        return cartRepository.save(cart); // Persistimos los cambios
    }


}
