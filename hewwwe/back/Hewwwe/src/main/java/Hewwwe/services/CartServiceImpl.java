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
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final InvoiceService invoiceService;
    private final ProductService productService;
    private final AddressService addressService;

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
    public void checkoutCart(Long cartId, Object addressData) {
        Cart cart = findById(cartId);
        Address shippingAddress = null;
        
        // Handle different types of address data
        if (addressData instanceof Map<?, ?>) {
            @SuppressWarnings("unchecked")
            Map<String, Object> addressMap = (Map<String, Object>) addressData;
            if (addressMap.containsKey("addressId")) {
                // Use existing address
                Long addressId = Long.valueOf(addressMap.get("addressId").toString());
                shippingAddress = addressService.getAddressById(addressId);
                if (shippingAddress == null) {
                    throw new ResourceNotFoundException("Address not found with ID: " + addressId);
                }
            } else {
                // Create a new address from the map data
                shippingAddress = new Address();
                shippingAddress.setStreet(addressMap.getOrDefault("street", "").toString());
                shippingAddress.setNumber(addressMap.getOrDefault("number", "").toString());
                shippingAddress.setCity(addressMap.getOrDefault("city", "").toString());
                shippingAddress.setCountry(addressMap.getOrDefault("country", "").toString());
                shippingAddress.setPostalCode(addressMap.getOrDefault("postalCode", "").toString());
                shippingAddress.setUser(cart.getUser());
            }
        } else if (addressData instanceof Address) {
            // Direct Address object
            shippingAddress = (Address) addressData;
        } else {
            throw new IllegalArgumentException("Invalid address data type");
        }
        
        // Create a list of products to be marked as sold
        List<Product> purchasedProducts = new ArrayList<>(cart.getProducts());
        
        // Create and save the invoice
        Invoice invoice = new Invoice();
        invoice.setInvoiceDate(new Date());
        invoice.setUser(cart.getUser());
        invoice.setAddress(shippingAddress);
        invoice.setProducts(purchasedProducts);
        invoice.setTotalAmount(calculateTotal(cartId));
        
        invoiceService.save(invoice);
        
        // Mark all products as SOLD
        System.out.println("CartService: Marking " + purchasedProducts.size() + " products as SOLD");
        for (Product product : purchasedProducts) {
            product.setStatus("SOLD");
            productService.save(product);
            System.out.println("CartService: Product " + product.getProductId() + " marked as SOLD");
        }
        
        // Clear the cart after checkout
        clearCart(cartId);
    }

    @Override
    public void addProduct(Long cartId, Long productId) {
        System.out.println("CartService: Adding product ID " + productId + " to cart ID " + cartId);
        Cart cart = findById(cartId);
        System.out.println("CartService: Found cart with " + (cart.getProducts() != null ? cart.getProducts().size() : "null") + " products");
        
        Product product = productService.getEntityById(productId);
        if (product != null) {
            System.out.println("CartService: Found product: " + product.getName());
            
            // Check if product is already in cart
            boolean alreadyInCart = cart.getProducts().stream()
                .anyMatch(p -> p.getProductId().equals(productId));
                
            if (alreadyInCart) {
                System.out.println("CartService: Product already in cart, skipping addition");
                return;
            }
            
            // Set bidirectional relationship
            product.setCart(cart);
            cart.getProducts().add(product);
            
            Cart savedCart = cartRepository.save(cart);
            System.out.println("CartService: Saved cart now has " + savedCart.getProducts().size() + " products");
        } else {
            System.out.println("CartService: Product not found with ID: " + productId);
        }
    }

    @Override
    public void removeProduct(Long cartId, Long productId) {
        Cart cart = findById(cartId);
        // Find the product and remove the bidirectional relationship
        cart.getProducts().stream()
            .filter(product -> product.getProductId().equals(productId))
            .findFirst()
            .ifPresent(product -> {
                product.setCart(null); // Remove the reference from product to cart
                cart.getProducts().remove(product);
            });
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
