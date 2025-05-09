package Hewwwe.controller;

import Hewwwe.dto.CartResponseDTO;
import Hewwwe.entity.Address;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Product;
import Hewwwe.services.CartService;
import Hewwwe.services.ProductService;
import Hewwwe.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
@Tag(name = "Cart Controller", description = "Cart management endpoints")
public class CartController {

    private final CartService cartService;
    private final ProductService productService;
    private final UserService userService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get a user's cart")
    public ResponseEntity<CartResponseDTO> getUserCart(@PathVariable Long userId) {
        CartResponseDTO cart = userService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/user/{userId}/products/{productId}")
    @Operation(summary = "Add a product to the user's cart")
    public ResponseEntity<CartResponseDTO> addToCart(@PathVariable Long userId, @PathVariable Long productId) {
        Product product = productService.getEntityById(productId);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        CartResponseDTO cartDTO = userService.getCartByUserId(userId);
        cartService.addProduct(cartDTO.getCartId(), productId);
        return ResponseEntity.ok(userService.getCartByUserId(userId));
    }

    @DeleteMapping("/user/{userId}/products/{productId}")
    @Operation(summary = "Remove a product from the user's cart")
    public ResponseEntity<CartResponseDTO> removeFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        Product product = productService.getEntityById(productId);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        CartResponseDTO cartDTO = userService.getCartByUserId(userId);
        cartService.removeProduct(cartDTO.getCartId(), productId);
        return ResponseEntity.ok(userService.getCartByUserId(userId));
    }

    @DeleteMapping("/user/{userId}/clear")
    @Operation(summary = "Clear the user's cart")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        CartResponseDTO cartDTO = userService.getCartByUserId(userId);
        cartService.clearCart(cartDTO.getCartId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/user/{userId}/checkout")
    @Operation(summary = "Checkout the user's cart")
    public ResponseEntity<String> checkout(@PathVariable Long userId, @RequestBody Address shippingAddress) {
        CartResponseDTO cartDTO = userService.getCartByUserId(userId);
        cartService.checkoutCart(cartDTO.getCartId(), shippingAddress);
        return ResponseEntity.ok("Checkout successful");
    }

    @GetMapping("/all")
    @Operation(summary = "Get all carts")
    public ResponseEntity<List<Cart>> getAllCarts() {
        return ResponseEntity.ok(cartService.findAll());
    }

    @DeleteMapping("/{cartId}")
    @Operation(summary = "Delete a cart")
    public ResponseEntity<Void> deleteCart(@PathVariable Long cartId) {
        cartService.deleteCart(cartId);
        return ResponseEntity.noContent().build();
    }
}
