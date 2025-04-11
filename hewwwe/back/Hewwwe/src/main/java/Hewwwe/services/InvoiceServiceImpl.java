package Hewwwe.services;

import Hewwwe.entity.*;
import Hewwwe.entity.enums.InvoiceStatus;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.repository.AddressRepository;
import Hewwwe.repository.InvoiceRepository;
import Hewwwe.repository.ProductRepository;
import Hewwwe.repository.UserRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final ExchangeService exchangeService;

    @Override
    public Invoice createInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
    }

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public List<Invoice> getInvoicesByUserId(Long userId) {
        return invoiceRepository.findByUser_UserId(userId);
    }

    @Override
    public Invoice updateInvoiceStatus(Long id, InvoiceStatus status) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus(status);
        return invoiceRepository.save(invoice);
    }

    @Override
    public void deleteInvoice(Long id) {
        if (!invoiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Invoice not found with id: " + id);
        }
        invoiceRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Invoice generateInvoiceFromExchange(Long exchangeId) {
        Exchange exchange = exchangeService.getExchangeById(exchangeId);
        
        Invoice invoice = new Invoice();
        invoice.setInvoiceDate(new Date());
        invoice.setUser(exchange.getRequester());
        invoice.setAddress(exchange.getRequester().getAddresses().get(0)); // Using first address
        invoice.setProducts(exchange.getProducts());
        invoice.setStatus(InvoiceStatus.PENDING);
        invoice.setTotalAmount(calculateTotalAmount(exchange.getProducts()));

        return invoiceRepository.save(invoice);
    }

    @Override
    @Transactional
    public Invoice generateInvoiceFromSale(Long userId, List<Long> productIds, Long addressId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id: " + addressId));
        
        List<Product> products = productRepository.findAllById(productIds);
        
        Invoice invoice = new Invoice();
        invoice.setInvoiceDate(new Date());
        invoice.setUser(user);
        invoice.setAddress(address);
        invoice.setProducts(products);
        invoice.setStatus(InvoiceStatus.PENDING);
        invoice.setTotalAmount(calculateTotalAmount(products));

        return invoiceRepository.save(invoice);
    }

    @Override
    public Resource generateInvoicePdf(Long invoiceId) {
        Invoice invoice = getInvoiceById(invoiceId);
        
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            
            document.open();
            
            // Add header
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("INVOICE", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            
            // Add invoice details
            document.add(new Paragraph("Invoice ID: " + invoice.getInvoiceId()));
            document.add(new Paragraph("Date: " + invoice.getInvoiceDate()));
            document.add(new Paragraph("Status: " + invoice.getStatus()));
            
            // Add user details
            document.add(new Paragraph("\nBILL TO:"));
            document.add(new Paragraph(invoice.getUser().getName()));
            document.add(new Paragraph(invoice.getAddress().getStreet()));
            document.add(new Paragraph(invoice.getAddress().getCity() + ", " + invoice.getAddress().getCountry()));
            
            // Add products table
            document.add(new Paragraph("\nPRODUCTS:"));
            for (Product product : invoice.getProducts()) {
                document.add(new Paragraph(product.getName() + " - $" + product.getPrice()));
            }
            
            // Add total
            document.add(new Paragraph("\nTotal Amount: $" + invoice.getTotalAmount()));
            
            document.close();
            
            return new ByteArrayResource(out.toByteArray());
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF for invoice: " + invoiceId, e);
        }
    }

    private Double calculateTotalAmount(List<Product> products) {
        return products.stream()
                .mapToDouble(Product::getPrice)
                .sum();
    }
}
