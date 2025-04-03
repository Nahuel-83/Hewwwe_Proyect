package Hewwwe.controller;

import Hewwwe.dto.ExchangeDTO;
import Hewwwe.dto.ProductDTO;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exchanges")
@RequiredArgsConstructor
@Tag(name = "Exchange Controller", description = "Exchange management endpoints")
public class ExchangeController {

    private final ExchangeService exchangeService;
    private final ModelMapper modelMapper;

    @GetMapping
    @Operation(summary = "Get all exchanges")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved exchanges")
    public ResponseEntity<List<ExchangeDTO>> getAllExchanges() {
        List<ExchangeDTO> exchanges = exchangeService.getAllExchanges().stream()
                .map(exchange -> modelMapper.map(exchange, ExchangeDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(exchanges);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an exchange by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved exchange")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeDTO> getExchangeById(@PathVariable Long id) {
        Exchange exchange = exchangeService.getExchangeById(id);
        return ResponseEntity.ok(modelMapper.map(exchange, ExchangeDTO.class));
    }

    @PostMapping
    @Operation(summary = "Create a new exchange")
    @ApiResponse(responseCode = "201", description = "Exchange created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<ExchangeDTO> createExchange(@Valid @RequestBody ExchangeDTO exchangeDTO) {
        try {
            Exchange exchange = modelMapper.map(exchangeDTO, Exchange.class);
            Exchange savedExchange = exchangeService.createExchange(exchange);
            return new ResponseEntity<>(modelMapper.map(savedExchange, ExchangeDTO.class), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Error creating exchange: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing exchange")
    @ApiResponse(responseCode = "200", description = "Exchange updated successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeDTO> updateExchange(
            @PathVariable Long id,
            @Valid @RequestBody ExchangeDTO exchangeDTO) {
        try {
            Exchange exchange = modelMapper.map(exchangeDTO, Exchange.class);
            Exchange updatedExchange = exchangeService.updateExchange(exchange);
            return ResponseEntity.ok(modelMapper.map(updatedExchange, ExchangeDTO.class));
        } catch (Exception e) {
            throw new RuntimeException("Error updating exchange: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an exchange")
    @ApiResponse(responseCode = "204", description = "Exchange deleted successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<Void> deleteExchange(@PathVariable Long id) {
        exchangeService.deleteExchange(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}/requested")
    @Operation(summary = "Get exchanges requested by a user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user's requested exchanges")
    public ResponseEntity<List<ExchangeDTO>> getExchangesByRequesterId(@PathVariable Long userId) {
        List<ExchangeDTO> exchanges = exchangeService.getExchangesByRequesterId(userId).stream()
                .map(exchange -> modelMapper.map(exchange, ExchangeDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(exchanges);
    }

    @GetMapping("/user/{userId}/owned")
    @Operation(summary = "Get exchanges where user is the owner")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user's owned exchanges")
    public ResponseEntity<List<ExchangeDTO>> getExchangesByOwnerId(@PathVariable Long userId) {
        List<ExchangeDTO> exchanges = exchangeService.getExchangesByOwnerId(userId).stream()
                .map(exchange -> modelMapper.map(exchange, ExchangeDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(exchanges);
    }

    @GetMapping("/{id}/products")
    @Operation(summary = "Get all products in an exchange")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved exchange products")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<List<ProductDTO>> getProductsByExchange(@PathVariable Long id) {
        Exchange exchange = exchangeService.getExchangeById(id);
        if (exchange == null) {
            throw new ResourceNotFoundException("Exchange not found with id: " + id);
        }
        
        List<ProductDTO> products = exchange.getProducts().stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update exchange status")
    @ApiResponse(responseCode = "200", description = "Exchange status updated successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<ExchangeDTO> updateExchangeStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Exchange updatedExchange = exchangeService.updateExchangeStatus(id, status);
        return ResponseEntity.ok(modelMapper.map(updatedExchange, ExchangeDTO.class));
    }
}
