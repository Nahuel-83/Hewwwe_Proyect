package Hewwwe.controller;

import Hewwwe.dto.CategoryCreateDTO;
import Hewwwe.dto.CategoryResponseDTO;
import Hewwwe.dto.ProductCreateDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.entity.Category;
import Hewwwe.entity.Product;
import Hewwwe.services.CategoryService;
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
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Category Controller", description = "Category management endpoints")
public class CategoryController {

    private final CategoryService categoryService;
    private final ModelMapper modelMapper;

    @GetMapping
    @Operation(summary = "Get all categories")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved categories")
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        List<CategoryResponseDTO> categories = categoryService.getAllCategories().stream()
                .map(category -> modelMapper.map(category, CategoryResponseDTO.class))
                .toList();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a category by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved category")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(modelMapper.map(category, CategoryResponseDTO.class));
    }

    @PostMapping
    @Operation(summary = "Create a new category")
    @ApiResponse(responseCode = "201", description = "Category created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<CategoryResponseDTO> createCategory(@Valid @RequestBody CategoryCreateDTO categoryDTO) {
        try {
            Category category = modelMapper.map(categoryDTO, Category.class);
            Category savedCategory = categoryService.createCategory(category);
            return new ResponseEntity<>(modelMapper.map(savedCategory, CategoryResponseDTO.class), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Error creating category: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing category")
    @ApiResponse(responseCode = "200", description = "Category updated successfully")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<CategoryResponseDTO> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryResponseDTO categoryDTO) {
        try {
            Category category = modelMapper.map(categoryDTO, Category.class);
            Category updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok(modelMapper.map(updatedCategory, CategoryResponseDTO.class));
        } catch (Exception e) {
            throw new RuntimeException("Error updating category: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a category")
    @ApiResponse(responseCode = "204", description = "Category deleted successfully")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/products")
    @Operation(summary = "Get all products in a category")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved category products")
    @ApiResponse(responseCode = "404", description = "Category not found")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByCategory(@PathVariable Long id) {
        List<Product> products = categoryService.getProductsByCategory(id);
        return ResponseEntity.ok(products.stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .toList());
    }

    @PostMapping("/{id}/products")
    @Operation(summary = "Add product to category")
    @ApiResponse(responseCode = "200", description = "Product added to category successfully")
    public ResponseEntity<ProductResponseDTO> addProductToCategory(
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateDTO productDTO) {
        Product product = modelMapper.map(productDTO, Product.class);
        Product savedProduct = categoryService.addProductToCategory(id, product);
        return ResponseEntity.ok(modelMapper.map(savedProduct, ProductResponseDTO.class));
    }
}
