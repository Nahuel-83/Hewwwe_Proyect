package Hewwwe.controller;

import Hewwwe.dto.AddressCreateDTO;
import Hewwwe.dto.AddressResponseDTO;
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
    public ResponseEntity<List<AddressResponseDTO>> getAllAddresses() {
        List<Address> addresses = addressService.getAllAddresses();
        List<AddressResponseDTO> addressDTOs = addresses.stream()
                .map(address -> modelMapper.map(address, AddressResponseDTO.class))
                .toList();
        return ResponseEntity.ok(addressDTOs);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an address by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved address")
    @ApiResponse(responseCode = "404", description = "Address not found")
    public ResponseEntity<AddressResponseDTO> getAddressById(@PathVariable Long id) {
        Address address = addressService.getAddressById(id);
        if (address == null) {
            return ResponseEntity.notFound().build();
        }
        AddressResponseDTO addressDTO = modelMapper.map(address, AddressResponseDTO.class);
        return ResponseEntity.ok(addressDTO);
    }

    @PostMapping("/user/{userId}")
    @Operation(summary = "Create a new address for a user")
    @ApiResponse(responseCode = "201", description = "Address created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ResponseEntity<AddressResponseDTO> createAddress(
            @PathVariable Long userId,
            @Valid @RequestBody AddressCreateDTO addressDTO) {

        Address address = modelMapper.map(addressDTO, Address.class);
        Address savedAddress = addressService.createAddress(address, userId);
        AddressResponseDTO responseDTO = modelMapper.map(savedAddress, AddressResponseDTO.class);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing address")
    @ApiResponse(responseCode = "200", description = "Address updated successfully")
    @ApiResponse(responseCode = "404", description = "Address not found")
    public ResponseEntity<AddressResponseDTO> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressCreateDTO addressDTO) {

        Address existing = addressService.getAddressById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }

        Address address = modelMapper.map(addressDTO, Address.class);
        address.setAddressId(id);
        address.setUser(existing.getUser()); // conservar el usuario
        Address updatedAddress = addressService.updateAddress(address);
        AddressResponseDTO responseDTO = modelMapper.map(updatedAddress, AddressResponseDTO.class);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an address")
    @ApiResponse(responseCode = "204", description = "Address deleted successfully")
    @ApiResponse(responseCode = "404", description = "Address not found")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        Address existing = addressService.getAddressById(id);
        if (existing == null) {  // Verificamos si la dirección no existe
            return ResponseEntity.notFound().build();
        }
        
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }



}
