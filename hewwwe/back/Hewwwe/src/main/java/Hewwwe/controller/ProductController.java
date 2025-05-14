package Hewwwe.controller;

import Hewwwe.dto.ProductCreateDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.dto.ProductUpdateDTO;
import Hewwwe.dto.UserResponseDTO;
import Hewwwe.entity.Product;
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

/**
 * Controlador REST que maneja las operaciones relacionadas con los productos.
 * Gestiona la creación, actualización, eliminación y consulta de productos.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Product Controller", description = "Product management endpoints")
public class ProductController {
    private final ProductService productService;
    private final ModelMapper modelMapper;

    @GetMapping
    @Operation(summary = "Get all available products")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved available products")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }
    
    @GetMapping("/admin/all")
    @Operation(summary = "Get all products including sold ones (Admin only)")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved all products")
    public ResponseEntity<List<ProductResponseDTO>> getAllProductsForAdmin() {
        return ResponseEntity.ok(productService.findAllForAdmin());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a product by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved product")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @GetMapping("/{id}/user")
    @Operation(summary = "Get product's user details")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user")
    @ApiResponse(responseCode = "404", description = "Product or user not found")
    public ResponseEntity<UserResponseDTO> getProductUser(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findUserByProductId(id));
    }

    @PostMapping
    @Operation(summary = "Create a new product")
    @ApiResponse(responseCode = "201", description = "Product created successfully")
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductCreateDTO productDTO) {
        ProductResponseDTO savedProduct = productService.save(productDTO);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing product")
    @ApiResponse(responseCode = "200", description = "Product updated successfully")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateDTO updateDTO) {

        Product product = modelMapper.map(updateDTO, Product.class);
        return ResponseEntity.ok(productService.update(id, product));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    @ApiResponse(responseCode = "204", description = "Product deleted successfully")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get products by category")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.findByCategory(categoryId));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get products by user")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(productService.findByUser(userId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get products by status")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(productService.findByStatus(status));
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by keyword")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }
}
