package Hewwwe.controller;

import Hewwwe.dto.ProductCreateDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Category;
import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import Hewwwe.exception.ResourceNotFoundException;
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
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Controller", description = "Product management endpoints")
public class ProductController {

    private final ProductService productService;
    private final ModelMapper modelMapper;

    @GetMapping
    @Operation(summary = "Get all products")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved products")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        List<ProductResponseDTO> products = productService.findAll().stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a product by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved product")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @PostMapping
    @Operation(summary = "Create a new product")
    @ApiResponse(responseCode = "201", description = "Product created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<ProductCreateDTO> createProduct(@Valid @RequestBody ProductCreateDTO productDTO) {
        try {
            Product product = new Product();
            mapDTOToProduct(productDTO, product);
            Product savedProduct = productService.save(product);
            return new ResponseEntity<>(modelMapper.map(savedProduct, ProductCreateDTO.class), HttpStatus.CREATED);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error creating product: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product")
    @ApiResponse(responseCode = "200", description = "Product updated successfully")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<ProductCreateDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateDTO productDTO) {
        try {
            if (!productService.existsById(id)) {
                throw new ResourceNotFoundException("Product not found with id: " + id);
            }
            Product product = new Product();
            mapDTOToProduct(productDTO, product);
            Product updatedProduct = productService.update(id, product);
            return ResponseEntity.ok(modelMapper.map(updatedProduct, ProductCreateDTO.class));
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating product: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    @ApiResponse(responseCode = "204", description = "Product deleted successfully")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved products")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        List<ProductResponseDTO> products = productService.findByCategory(categoryId).stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get products by user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved products")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByUser(@PathVariable Long userId) {
        List<ProductResponseDTO> products = productService.findByUser(userId).stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get products by status")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved products")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByStatus(@PathVariable String status) {
        List<ProductResponseDTO> products = productService.findByStatus(status).stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved products")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts(@RequestParam String keyword) {
        List<ProductResponseDTO> products = productService.searchProducts(keyword).stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    private void mapDTOToProduct(ProductCreateDTO dto, Product product) {
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImage(dto.getImage());
        product.setSize(dto.getSize());
        product.setStatus(dto.getStatus());
        product.setPublicationDate(dto.getPublicationDate());

        // Set User
        if (dto.getUserId() != null) {
            User user = new User();
            user.setUserId(dto.getUserId());
            product.setUser(user);
        }

        // Set Category
        if (dto.getCategoryId() != null) {
            Category category = new Category();
            category.setCategoryId(dto.getCategoryId());
            product.setCategory(category);
        }

        // Set Cart
        if (dto.getCartId() != null) {
            Cart cart = new Cart();
            cart.setCartId(dto.getCartId());
            product.setCart(cart);
        }

        // Set Exchange
        if (dto.getExchangeId() != null) {
            Exchange exchange = new Exchange();
            exchange.setExchangeId(dto.getExchangeId());
            product.setExchange(exchange);
        }
    }
}
