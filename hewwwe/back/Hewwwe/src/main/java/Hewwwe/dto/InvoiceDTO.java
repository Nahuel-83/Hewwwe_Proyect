package Hewwwe.dto;

import Hewwwe.entity.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {
    private Long invoiceId;
    private Date invoiceDate;
    private Double totalAmount;
    private InvoiceStatus status;
    private Long userId;
    private Long addressId;
    private List<Long> productIds;
    private String pdfUrl;  // URL to download the generated PDF
}
