package Hewwwe.services;

import Hewwwe.entity.Invoice;
import Hewwwe.entity.InvoiceStatus;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InvoiceService {
    Invoice createInvoice(Invoice invoice);
    Invoice getInvoiceById(Long id);
    List<Invoice> getAllInvoices();
    List<Invoice> getInvoicesByUserId(Long userId);
    Invoice updateInvoiceStatus(Long id, InvoiceStatus status);
    void deleteInvoice(Long id);
    
    // Special methods for invoice handling
    Invoice generateInvoiceFromExchange(Long exchangeId);
    Invoice generateInvoiceFromSale(Long userId, List<Long> productIds, Long addressId);
    Resource generateInvoicePdf(Long invoiceId);
}
