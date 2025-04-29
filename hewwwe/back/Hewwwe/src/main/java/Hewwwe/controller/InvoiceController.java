package Hewwwe.controller;

import Hewwwe.dto.InvoiceCreateDTO;
import Hewwwe.dto.InvoiceResponseDTO;
import Hewwwe.entity.Invoice;
import Hewwwe.services.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST que maneja las operaciones relacionadas con las facturas.
 * Gestiona la generación, consulta y actualización de facturas del sistema.
 */
@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoice Controller", description = "Invoice management endpoints")
public class InvoiceController {
    private final InvoiceService invoiceService;
    private final ModelMapper modelMapper;

    @GetMapping("/{id}")
    @Operation(summary = "Get an invoice by ID")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceById(@PathVariable Long id) {
        Invoice invoice = invoiceService.findById(id);
        return ResponseEntity.ok(modelMapper.map(invoice, InvoiceResponseDTO.class));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get invoices by user ID")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByUserId(@PathVariable Long userId) {
        List<InvoiceResponseDTO> invoices = invoiceService.findByUserId(userId).stream()
                .map(invoice -> modelMapper.map(invoice, InvoiceResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(invoices);
    }

    @PostMapping
    @Operation(summary = "Create new invoice")
    public ResponseEntity<InvoiceResponseDTO> createInvoice(@Valid @RequestBody InvoiceCreateDTO invoiceDTO) {
        Invoice invoice = modelMapper.map(invoiceDTO, Invoice.class);
        Invoice savedInvoice = invoiceService.save(invoice);
        return new ResponseEntity<>(modelMapper.map(savedInvoice, InvoiceResponseDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an invoice")
    public ResponseEntity<InvoiceResponseDTO> updateInvoice(
            @PathVariable Long id, 
            @Valid @RequestBody InvoiceCreateDTO invoiceDTO) {
        Invoice invoice = modelMapper.map(invoiceDTO, Invoice.class);
        Invoice updatedInvoice = invoiceService.update(id, invoice);
        return ResponseEntity.ok(modelMapper.map(updatedInvoice, InvoiceResponseDTO.class));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an invoice")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
