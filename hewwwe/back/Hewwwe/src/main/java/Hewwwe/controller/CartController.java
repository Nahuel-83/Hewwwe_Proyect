package Hewwwe.controller;

import Hewwwe.dto.CartCreateDTO;
import Hewwwe.dto.CartResponseDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.entity.Address;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Product;
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
@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
@Tag(name = "Cart Controller", description = "Cart management endpoints")
public class CartController {
    private final CartService cartService;
    private final ProductService productService;
    private final ModelMapper modelMapper;

    @GetMapping("/{id}")
    @Operation(summary = "Get a cart by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved cart")
    @ApiResponse(responseCode = "404", description = "Cart not found")
    public ResponseEntity<CartResponseDTO> getCartById(@PathVariable Long id) {
        Cart cart = cartService.findById(id);
        return ResponseEntity.ok(modelMapper.map(cart, CartResponseDTO.class));
    }

    @PostMapping
    @Operation(summary = "Create a new cart")
    @ApiResponse(responseCode = "201", description = "Cart created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<CartResponseDTO> createCart(@Valid @RequestBody CartCreateDTO cartDTO) {
        Cart cart = modelMapper.map(cartDTO, Cart.class);
        Cart savedCart = cartService.save(cart);
        return new ResponseEntity<>(modelMapper.map(savedCart, CartResponseDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing cart")
    @ApiResponse(responseCode = "200", description = "Cart updated successfully")
    @ApiResponse(responseCode = "404", description = "Cart not found")
    public ResponseEntity<CartResponseDTO> updateCart(@PathVariable Long id, @Valid @RequestBody CartCreateDTO cartDTO) {
        Cart cart = modelMapper.map(cartDTO, Cart.class);
        Cart updatedCart = cartService.update(id, cart);
        return ResponseEntity.ok(modelMapper.map(updatedCart, CartResponseDTO.class));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a cart")
    @ApiResponse(responseCode = "204", description = "Cart deleted successfully")
    @ApiResponse(responseCode = "404", description = "Cart not found")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        cartService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{cartId}/products/{productId}")
    @Operation(summary = "Add product to cart")
    public ResponseEntity<CartResponseDTO> addProductToCart(@PathVariable Long cartId, @PathVariable Long productId) {
        Product product = productService.getEntityById(productId); // Assuming you add this method to ProductService
        cartService.addProduct(cartId, product);
        Cart updatedCart = cartService.findById(cartId);
        return ResponseEntity.ok(modelMapper.map(updatedCart, CartResponseDTO.class));
    }

    @DeleteMapping("/{cartId}/products/{productId}")
    @Operation(summary = "Remove product from cart")
    @ApiResponse(responseCode = "200", description = "Product removed from cart successfully")
    public ResponseEntity<CartResponseDTO> removeProductFromCart(@PathVariable Long cartId, @PathVariable Long productId) {
        cartService.removeProduct(cartId, productId);
        Cart updatedCart = cartService.findById(cartId);
        return ResponseEntity.ok(modelMapper.map(updatedCart, CartResponseDTO.class));
    }

    @PostMapping("/{cartId}/checkout")
    @Operation(summary = "Checkout cart")
    public ResponseEntity<Void> checkoutCart(@PathVariable Long cartId, @RequestBody Address shippingAddress) {
        cartService.checkoutCart(cartId, shippingAddress);
        return ResponseEntity.ok().build();
    }
}
