package Hewwwe.controller;

import Hewwwe.dto.CartDTO;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Product;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.services.CartService;
import Hewwwe.services.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
@Tag(name = "Cart Controller", description = "Cart management endpoints")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final ProductService productService;
    private final ModelMapper modelMapper;

    @GetMapping
    @Operation(summary = "Get all carts")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved carts")
    public ResponseEntity<List<CartDTO>> getAllCarts() {
        List<CartDTO> carts = cartService.getAllCarts().stream()
                .map(cart -> modelMapper.map(cart, CartDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(carts);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a cart by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved cart")
    @ApiResponse(responseCode = "404", description = "Cart not found")
    public ResponseEntity<CartDTO> getCartById(@PathVariable Long id) {
        Cart cart = cartService.getCartById(id);
        return ResponseEntity.ok(modelMapper.map(cart, CartDTO.class));
    }

    @PostMapping
    @Operation(summary = "Create a new cart")
    @ApiResponse(responseCode = "201", description = "Cart created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<CartDTO> createCart(@Valid @RequestBody CartDTO cartDTO) {
        try {
            Cart cart = modelMapper.map(cartDTO, Cart.class);
            Cart savedCart = cartService.saveCart(cart);
            return new ResponseEntity<>(modelMapper.map(savedCart, CartDTO.class), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Error creating cart: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing cart")
    @ApiResponse(responseCode = "200", description = "Cart updated successfully")
    @ApiResponse(responseCode = "404", description = "Cart not found")
    public ResponseEntity<CartDTO> updateCart(
            @PathVariable Long id,
            @Valid @RequestBody CartDTO cartDTO) {
        try {
            Cart cart = modelMapper.map(cartDTO, Cart.class);
            cart.setCartId(id);
            Cart updatedCart = cartService.updateCart(cart);
            return ResponseEntity.ok(modelMapper.map(updatedCart, CartDTO.class));
        } catch (Exception e) {
            throw new RuntimeException("Error updating cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a cart")
    @ApiResponse(responseCode = "204", description = "Cart deleted successfully")
    @ApiResponse(responseCode = "404", description = "Cart not found")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        cartService.deleteCartById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{cartId}/products/{productId}")
    @Operation(summary = "Add product to cart")
    @ApiResponse(responseCode = "200", description = "Product added to cart successfully")
    public ResponseEntity<CartDTO> addProductToCart(@PathVariable Long cartId, @PathVariable Long productId) {
        Product product = productService.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        Cart updatedCart = cartService.addProductToCart(cartId, product);
        return ResponseEntity.ok(modelMapper.map(updatedCart, CartDTO.class));
    }

    @DeleteMapping("/{cartId}/products/{productId}")
    @Operation(summary = "Remove product from cart")
    @ApiResponse(responseCode = "200", description = "Product removed from cart successfully")
    public ResponseEntity<CartDTO> removeProductFromCart(@PathVariable Long cartId, @PathVariable Long productId) {
        Cart updatedCart = cartService.removeProductFromCart(cartId, productId);
        return ResponseEntity.ok(modelMapper.map(updatedCart, CartDTO.class));
    }
}
