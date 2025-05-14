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
        
        // Validar y filtrar productos
        List<Product> validProducts = new ArrayList<>();
        for (Product product : cart.getProducts()) {
            if (product != null && product.getProductId() != null) {
                validProducts.add(product);
            }
        }
        
        if (validProducts.isEmpty()) {
            throw new IllegalStateException("No valid products found in cart for checkout");
        }
        
        // Create and save the invoice
        Invoice invoice = new Invoice();
        invoice.setInvoiceDate(new Date());
        invoice.setUser(cart.getUser());
        invoice.setAddress(shippingAddress);
        invoice.setProducts(validProducts);
        invoice.setTotalAmount(calculateTotal(cartId));
        
        invoiceService.save(invoice);
        
        // Mark all products as SOLD
        for (Product product : validProducts) {
            try {
                product.setStatus("SOLD");
                productService.save(product);
            } catch (Exception e) {
                System.err.println("CartService: Error marking product " + product.getProductId() + " as SOLD: " + e.getMessage());
                // Continue with other products even if one fails
            }
        }
        
        // Clear the cart after checkout
        clearCart(cartId);
    }

    @Override
    public void addProduct(Long cartId, Long productId) {
        Cart cart = findById(cartId);
        
        Product product = productService.getEntityById(productId);
        if (product != null) {
            // Check if product is already in cart
            boolean alreadyInCart = cart.getProducts().stream()
                .anyMatch(p -> p.getProductId().equals(productId));
                
            if (alreadyInCart) {
                return;
            }
            
            // Set bidirectional relationship
            product.setCart(cart);
            cart.getProducts().add(product);
            
            cartRepository.save(cart);
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
        
        try {
            cart.clearCart();
            
            // Additional verification
            if (cart.getProducts().size() > 0) {
                // Force clear if necessary
                for (Product product : new ArrayList<>(cart.getProducts())) {
                    product.setCart(null);
                }
                cart.getProducts().clear();
            }
            
            cartRepository.save(cart);
        } catch (Exception e) {
            System.err.println("CartService: Error clearing cart: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw to ensure callers know there was a problem
        }
    }

    @Override
    public Double calculateTotal(Long cartId) {
        Cart cart = findById(cartId);
        return cart.getProducts().stream()
                .mapToDouble(Product::getPrice)
                .sum();
    }
}
