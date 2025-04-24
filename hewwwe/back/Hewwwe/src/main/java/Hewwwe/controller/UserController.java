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

/**
 * Controlador REST que maneja las operaciones relacionadas con los usuarios.
 * Proporciona endpoints para la gestión de usuarios, incluyendo CRUD y operaciones relacionadas.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Controller", description = "User management endpoints")
public class UserController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    /**
     * Obtiene todos los usuarios registrados en el sistema.
     *
     * @return ResponseEntity con la lista de usuarios
     */
    @GetMapping
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     * Obtiene un usuario por su ID.
     *
     * @param id ID del usuario
     * @return ResponseEntity con los detalles del usuario
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    /**
     * Crea un nuevo usuario.
     *
     * @param userDTO Datos del usuario a crear
     * @return ResponseEntity con los detalles del usuario creado
     */
    @PostMapping
    @Operation(summary = "Create a new user")
    public ResponseEntity<UserCreateDTO> createUser(@Valid @RequestBody UserCreateDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        User savedUser = userService.save(user);
        return new ResponseEntity<>(modelMapper.map(savedUser, UserCreateDTO.class), HttpStatus.CREATED);
    }

    /**
     * Actualiza un usuario existente.
     *
     * @param id ID del usuario a actualizar
     * @param userDTO Datos actualizados del usuario
     * @return ResponseEntity con los detalles del usuario actualizado
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing user")
    public ResponseEntity<UserCreateDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserCreateDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        User updatedUser = userService.update(id, user);
        return ResponseEntity.ok(modelMapper.map(updatedUser, UserCreateDTO.class));
    }

    /**
     * Elimina un usuario por su ID.
     *
     * @param id ID del usuario a eliminar
     * @return ResponseEntity sin contenido
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene el carrito de compras de un usuario.
     *
     * @param id ID del usuario
     * @return ResponseEntity con los detalles del carrito
     */
    @GetMapping("/{id}/cart")
    @Operation(summary = "Get user's cart")
    public ResponseEntity<CartResponseDTO> getUserCart(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getCartByUserId(id));
    }

    /**
     * Obtiene las direcciones de un usuario.
     *
     * @param id ID del usuario
     * @return ResponseEntity con la lista de direcciones
     */
    @GetMapping("/{id}/addresses")
    @Operation(summary = "Get user's addresses")
    public ResponseEntity<List<AddressResponseDTO>> getUserAddresses(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getAddressesByUserId(id));
    }

    /**
     * Obtiene los productos de un usuario.
     *
     * @param id ID del usuario
     * @return ResponseEntity con la lista de productos
     */
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

    /**
     * Obtiene los intercambios de un usuario (solicitados y propios).
     *
     * @param id ID del usuario
     * @return ResponseEntity con la lista de intercambios
     */
    @GetMapping("/{id}/exchanges")
    @Operation(summary = "Get user's exchanges (requested + owned)")
    public ResponseEntity<List<ExchangeResponseDTO>> getUserExchanges(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getExchangesByUserId(id));
    }
}
