package Hewwwe.services;

import Hewwwe.entity.Cart;
import Hewwwe.entity.Product;
import Hewwwe.entity.Invoice;
import Hewwwe.entity.Address;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final InvoiceService invoiceService;
    private final ProductService productService;

    @Override
    public Cart findById(Long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }
    
    @Override
    public List<Cart> findAll() {
        return cartRepository.findAll();
    }

    @Override
    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public Cart update(Long id, Cart cart) {
        Cart existingCart = findById(id);
        existingCart.setCartDate(cart.getCartDate());
        existingCart.setProducts(cart.getProducts());
        return cartRepository.save(existingCart);
    }

    @Override
    public void delete(Long id) {
        cartRepository.deleteById(id);
    }

    @Override
    public void deleteCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    @Override
    public void checkoutCart(Long cartId, Address shippingAddress) {
        Cart cart = findById(cartId);
        
        Invoice invoice = new Invoice();
        invoice.setInvoiceDate(new Date());
        invoice.setUser(cart.getUser());
        invoice.setAddress(shippingAddress);
        invoice.setProducts(new ArrayList<>(cart.getProducts()));
        invoice.setTotalAmount(calculateTotal(cartId));
        
        invoiceService.save(invoice);
        clearCart(cartId);
    }

    @Override
    public void addProduct(Long cartId, Long productId) {
        Cart cart = findById(cartId);
        Product product = productService.getEntityById(productId);
        if (product != null) {
            cart.getProducts().add(product);
            cartRepository.save(cart);
        }
    }

    @Override
    public void removeProduct(Long cartId, Long productId) {
        Cart cart = findById(cartId);
        cart.getProducts().removeIf(product -> product.getProductId().equals(productId));
        cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long cartId) {
        Cart cart = findById(cartId);
        cart.clearCart();
        cartRepository.save(cart);
    }

    @Override
    public Double calculateTotal(Long cartId) {
        Cart cart = findById(cartId);
        return cart.getProducts().stream()
                .mapToDouble(Product::getPrice)
                .sum();
    }
}
