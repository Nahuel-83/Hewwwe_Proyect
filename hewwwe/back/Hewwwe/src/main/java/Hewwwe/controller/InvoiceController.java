package Hewwwe.controller;

import Hewwwe.dto.InvoiceCreateDTO;
import Hewwwe.dto.InvoiceResponseDTO;
import Hewwwe.entity.Invoice;
import Hewwwe.entity.enums.InvoiceStatus;
import Hewwwe.services.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoice Controller", description = "Invoice management endpoints")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final ModelMapper modelMapper;

    @GetMapping
    @Operation(summary = "Get all invoices")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved invoices")
    public ResponseEntity<List<InvoiceResponseDTO>> getAllInvoices() {
        List<InvoiceResponseDTO> invoices = invoiceService.getAllInvoices().stream()
                .map(invoice -> modelMapper.map(invoice, InvoiceResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an invoice by ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved invoice")
    @ApiResponse(responseCode = "404", description = "Invoice not found")
    public ResponseEntity<InvoiceResponseDTO> getInvoiceById(@PathVariable Long id) {
        Invoice invoice = invoiceService.getInvoiceById(id);
        return ResponseEntity.ok(modelMapper.map(invoice, InvoiceResponseDTO.class));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get invoices by user ID")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved user's invoices")
    public ResponseEntity<List<InvoiceResponseDTO>> getInvoicesByUserId(@PathVariable Long userId) {
        List<InvoiceResponseDTO> invoices = invoiceService.getInvoicesByUserId(userId).stream()
                .map(invoice -> modelMapper.map(invoice, InvoiceResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(invoices);
    }

    @PostMapping("/exchange/{exchangeId}")
    @Operation(summary = "Generate invoice from exchange")
    @ApiResponse(responseCode = "201", description = "Invoice created successfully")
    @ApiResponse(responseCode = "404", description = "Exchange not found")
    public ResponseEntity<InvoiceCreateDTO> generateInvoiceFromExchange(@PathVariable Long exchangeId) {
        Invoice invoice = invoiceService.generateInvoiceFromExchange(exchangeId);
        return ResponseEntity.ok(modelMapper.map(invoice, InvoiceCreateDTO.class));
    }

    @PostMapping("/sale")
    @Operation(summary = "Generate invoice from sale")
    @ApiResponse(responseCode = "201", description = "Invoice created successfully")
    @ApiResponse(responseCode = "404", description = "User or products not found")
    public ResponseEntity<InvoiceResponseDTO> generateInvoiceFromSale(
            @RequestParam Long userId,
            @RequestParam Long addressId,
            @RequestParam List<Long> productIds) {
        Invoice invoice = invoiceService.generateInvoiceFromSale(userId, productIds, addressId);
        return ResponseEntity.ok(modelMapper.map(invoice, InvoiceResponseDTO.class));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update invoice status")
    @ApiResponse(responseCode = "200", description = "Invoice status updated successfully")
    @ApiResponse(responseCode = "404", description = "Invoice not found")
    public ResponseEntity<InvoiceResponseDTO> updateInvoiceStatus(
            @PathVariable Long id,
            @RequestParam InvoiceStatus status) {
        Invoice invoice = invoiceService.updateInvoiceStatus(id, status);
        return ResponseEntity.ok(modelMapper.map(invoice, InvoiceResponseDTO.class));
    }

    @GetMapping("/{id}/pdf")
    @Operation(summary = "Download invoice PDF")
    @ApiResponse(responseCode = "200", description = "PDF generated successfully")
    @ApiResponse(responseCode = "404", description = "Invoice not found")
    public ResponseEntity<Resource> downloadInvoicePdf(@PathVariable Long id) {
        Resource pdfResource = invoiceService.generateInvoicePdf(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"invoice-" + id + ".pdf\"")
                .body(pdfResource);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an invoice")
    @ApiResponse(responseCode = "204", description = "Invoice deleted successfully")
    @ApiResponse(responseCode = "404", description = "Invoice not found")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
