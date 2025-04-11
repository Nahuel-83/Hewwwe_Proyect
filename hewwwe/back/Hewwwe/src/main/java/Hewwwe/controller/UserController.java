package Hewwwe.controller;

import Hewwwe.dto.UserCreateDTO;
import Hewwwe.dto.UserResponseDTO;
import Hewwwe.entity.User;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Address;
import Hewwwe.entity.Product;
import Hewwwe.entity.Exchange;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.services.UserService;
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
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Controller", description = "User management endpoints")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @GetMapping
    @Operation(summary = "Get all users")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @PostMapping
    @Operation(summary = "Create a new user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<UserCreateDTO> createUser(@Valid @RequestBody UserCreateDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        User savedUser = userService.save(user);
        return new ResponseEntity<>(modelMapper.map(savedUser, UserCreateDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing user")
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserResponseDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(modelMapper.map(updatedUser, UserResponseDTO.class));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user")
    @ApiResponse(responseCode = "204", description = "User deleted successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/cart")
    @Operation(summary = "Get user's cart")
    public ResponseEntity<Cart> getUserCart(@PathVariable Long id) {
        Cart cart = userService.getCartByUserId(id);
        return ResponseEntity.ok(cart);
    }

    @GetMapping("/{id}/addresses")
    @Operation(summary = "Get user's addresses")
    public ResponseEntity<List<Address>> getUserAddresses(@PathVariable Long id) {
        List<Address> addresses = userService.getAddressesByUserId(id);
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}/products")
    @Operation(summary = "Get user's products")
    public ResponseEntity<List<Product>> getUserProducts(@PathVariable Long id) {
        List<Product> products = userService.getProductsByUserId(id);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}/exchanges")
    @Operation(summary = "Get user's exchanges (requested + owned)")
    public ResponseEntity<List<Exchange>> getUserExchanges(@PathVariable Long id) {
        List<Exchange> exchanges = userService.getExchangesByUserId(id);
        return ResponseEntity.ok(exchanges);
    }
}
