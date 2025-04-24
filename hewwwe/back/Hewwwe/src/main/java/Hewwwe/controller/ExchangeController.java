package Hewwwe.controller;

import Hewwwe.dto.ExchangeCreateDTO;
import Hewwwe.dto.ExchangeResponseDTO;
import Hewwwe.dto.ProductResponseDTO;
import Hewwwe.entity.Exchange;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.services.ExchangeService;
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
 * Controlador REST que maneja las operaciones relacionadas con los intercambios.
 * Gestiona la creación, actualización y seguimiento de intercambios entre usuarios.
 */
@RestController
@RequestMapping("/api/exchanges")
@RequiredArgsConstructor
@Tag(name = "Exchange Controller", description = "Exchange management endpoints")
public class ExchangeController {

    private final ExchangeService exchangeService;
    private final ModelMapper modelMapper;

    /**
     * Obtiene todos los intercambios registrados en el sistema.
     *
     * @return ResponseEntity con la lista de intercambios
     */
    @GetMapping
    @Operation(summary = "Get all exchanges")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved exchanges")
    public ResponseEntity<List<ExchangeResponseDTO>> getAllExchanges() {
        List<ExchangeResponseDTO> exchanges = exchangeService.getAllExchanges().stream()
                .map(exchange -> modelMapper.map(exchange, ExchangeResponseDTO.class))
                .toList();
        return ResponseEntity.ok(exchanges);
    }

    /**
     * Obtiene un intercambio por su ID.
     *
     * @param id ID del intercambio
     * @return ResponseEntity con el intercambio solicitado
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get an exchange by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved exchange")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeResponseDTO> getExchangeById(@PathVariable Long id) {
        Exchange exchange = exchangeService.getExchangeById(id);
        return ResponseEntity.ok(modelMapper.map(exchange, ExchangeResponseDTO.class));
    }

    /**
     * Crea un nuevo intercambio.
     *
     * @param exchangeDTO DTO con los datos del intercambio a crear
     * @return ResponseEntity con el intercambio creado
     */
    @PostMapping
    @Operation(summary = "Create a new exchange")
    @ApiResponse(responseCode = "201", description = "Exchange created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<ExchangeResponseDTO> createExchange(@Valid @RequestBody ExchangeCreateDTO exchangeDTO) {
        try {
            Exchange exchange = modelMapper.map(exchangeDTO, Exchange.class);
            Exchange savedExchange = exchangeService.createExchange(exchange);
            return new ResponseEntity<>(modelMapper.map(savedExchange, ExchangeResponseDTO.class), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Error creating exchange: " + e.getMessage());
        }
    }

    /**
     * Actualiza un intercambio existente.
     *
     * @param id ID del intercambio a actualizar
     * @param exchangeDTO DTO con los datos actualizados del intercambio
     * @return ResponseEntity con el intercambio actualizado
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update an existing exchange")
    @ApiResponse(responseCode = "200", description = "Exchange updated successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeResponseDTO> updateExchange(
            @PathVariable Long id,
            @Valid @RequestBody ExchangeResponseDTO exchangeDTO) {
        try {
            Exchange exchange = modelMapper.map(exchangeDTO, Exchange.class);
            Exchange updatedExchange = exchangeService.updateExchange(exchange);
            return ResponseEntity.ok(modelMapper.map(updatedExchange, ExchangeResponseDTO.class));
        } catch (Exception e) {
            throw new RuntimeException("Error updating exchange: " + e.getMessage());
        }
    }

    /**
     * Elimina un intercambio.
     *
     * @param id ID del intercambio a eliminar
     * @return ResponseEntity sin contenido
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an exchange")
    @ApiResponse(responseCode = "204", description = "Exchange deleted successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<Void> deleteExchange(@PathVariable Long id) {
        exchangeService.deleteExchange(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Obtiene los intercambios solicitados por un usuario.
     *
     * @param userId ID del usuario solicitante
     * @return ResponseEntity con la lista de intercambios solicitados
     */
    @GetMapping("/user/{userId}/requested")
    @Operation(summary = "Get exchanges requested by a user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user's requested exchanges")
    public ResponseEntity<List<ExchangeResponseDTO>> getExchangesByRequesterId(@PathVariable Long userId) {
        List<ExchangeResponseDTO> exchanges = exchangeService.getExchangesByRequesterId(userId).stream()
                .map(exchange -> modelMapper.map(exchange, ExchangeResponseDTO.class))
                .toList();
        return ResponseEntity.ok(exchanges);
    }

    /**
     * Obtiene los intercambios donde el usuario es el propietario.
     *
     * @param userId ID del usuario propietario
     * @return ResponseEntity con la lista de intercambios donde el usuario es propietario
     */
    @GetMapping("/user/{userId}/owned")
    @Operation(summary = "Get exchanges where user is the owner")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user's owned exchanges")
    public ResponseEntity<List<ExchangeResponseDTO>> getExchangesByOwnerId(@PathVariable Long userId) {
        List<ExchangeResponseDTO> exchanges = exchangeService.getExchangesByOwnerId(userId).stream()
                .map(exchange -> modelMapper.map(exchange, ExchangeResponseDTO.class))
                .toList();
        return ResponseEntity.ok(exchanges);
    }

    /**
     * Obtiene todos los productos en un intercambio.
     *
     * @param id ID del intercambio
     * @return ResponseEntity con la lista de productos en el intercambio
     */
    @GetMapping("/{id}/products")
    @Operation(summary = "Get all products in an exchange")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved exchange products")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<List<ProductResponseDTO>> getProductsByExchange(@PathVariable Long id) {
        Exchange exchange = exchangeService.getExchangeById(id);
        if (exchange == null) {
            throw new ResourceNotFoundException("Exchange not found with id: " + id);
        }
        
        List<ProductResponseDTO> products = exchange.getProducts().stream()
                .map(product -> modelMapper.map(product, ProductResponseDTO.class))
                .toList();
        
        return ResponseEntity.ok(products);
    }

    /**
     * Actualiza el estado de un intercambio.
     *
     * @param id ID del intercambio
     * @param status Nuevo estado del intercambio
     * @return ResponseEntity con el intercambio actualizado
     */
    @PutMapping("/{id}/status")
    @Operation(summary = "Update exchange status")
    @ApiResponse(responseCode = "200", description = "Exchange status updated successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeResponseDTO> updateExchangeStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Exchange updatedExchange = exchangeService.updateExchangeStatus(id, status);
        return ResponseEntity.ok(modelMapper.map(updatedExchange, ExchangeResponseDTO.class));
    }
}
