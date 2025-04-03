package Hewwwe.controller;

import Hewwwe.dto.AddressDTO;
import Hewwwe.entity.Address;
import Hewwwe.services.AddressService;
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
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Tag(name = "Address Controller", description = "Address management endpoints")
public class AddressController {

    private final AddressService addressService;
    private final ModelMapper modelMapper;

    @GetMapping
    @Operation(summary = "Get all addresses")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved addresses")
    public ResponseEntity<List<AddressDTO>> getAllAddresses() {
        List<AddressDTO> addresses = addressService.getAllAddresses().stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(addresses);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an address by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved address")
    @ApiResponse(responseCode = "404", description = "Address not found")
    public ResponseEntity<AddressDTO> getAddressById(@PathVariable Long id) {
        Address address = addressService.getAddressById(id);
        return ResponseEntity.ok(modelMapper.map(address, AddressDTO.class));
    }

    @PostMapping("/user/{userId}")
    @Operation(summary = "Create a new address for a user")
    @ApiResponse(responseCode = "201", description = "Address created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<AddressDTO> createAddress(
            @PathVariable Long userId,
            @Valid @RequestBody AddressDTO addressDTO) {
        try {
            Address address = modelMapper.map(addressDTO, Address.class);
            Address savedAddress = addressService.createAddress(address, userId);
            return new ResponseEntity<>(modelMapper.map(savedAddress, AddressDTO.class), HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Error creating address: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing address")
    @ApiResponse(responseCode = "200", description = "Address updated successfully")
    @ApiResponse(responseCode = "404", description = "Address not found")
    public ResponseEntity<AddressDTO> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressDTO addressDTO) {
        try {
            Address address = modelMapper.map(addressDTO, Address.class);
            address.setAddressId(id);
            Address updatedAddress = addressService.updateAddress(address);
            return ResponseEntity.ok(modelMapper.map(updatedAddress, AddressDTO.class));
        } catch (Exception e) {
            throw new RuntimeException("Error updating address: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an address")
    @ApiResponse(responseCode = "204", description = "Address deleted successfully")
    @ApiResponse(responseCode = "404", description = "Address not found")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all addresses for a user")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user addresses")
    public ResponseEntity<List<AddressDTO>> getAddressesByUserId(@PathVariable Long userId) {
        List<AddressDTO> addresses = addressService.getAddressesByUserId(userId).stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(addresses);
    }
}
