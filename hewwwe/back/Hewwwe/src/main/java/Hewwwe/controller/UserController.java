package Hewwwe.controller;

import Hewwwe.dto.AddressResponseDTO;
import Hewwwe.dto.CartResponseDTO;
import Hewwwe.dto.ExchangeResponseDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.dto.UserCreateDTO;
import Hewwwe.dto.UserResponseDTO;
import Hewwwe.entity.*;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
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
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @PostMapping
    @Operation(summary = "Create a new user")
    public ResponseEntity<UserCreateDTO> createUser(@Valid @RequestBody UserCreateDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        User savedUser = userService.save(user);
        return new ResponseEntity<>(modelMapper.map(savedUser, UserCreateDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing user")
    public ResponseEntity<UserCreateDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserCreateDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(modelMapper.map(updatedUser, UserCreateDTO.class));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/cart")
    @Operation(summary = "Get user's cart")
    public ResponseEntity<CartResponseDTO> getUserCart(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getCartByUserId(id));
    }

    @GetMapping("/{id}/addresses")
    @Operation(summary = "Get user's addresses")
    public ResponseEntity<List<AddressResponseDTO>> getUserAddresses(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getAddressesByUserId(id));
    }

    @GetMapping("/{id}/products")
    @Operation(summary = "Get user's products")
    public ResponseEntity<List<ProductResponseDTO>> getUserProducts(@PathVariable Long id) {
        try {
            List<ProductResponseDTO> products = userService.getProductsByUserId(id);
            return ResponseEntity.ok(products);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/{id}/exchanges")
    @Operation(summary = "Get user's exchanges (requested + owned)")
    public ResponseEntity<List<ExchangeResponseDTO>> getUserExchanges(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getExchangesByUserId(id));
    }
}
