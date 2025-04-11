package Hewwwe.entity;

import Hewwwe.entity.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "invoice")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceId;

    private Date invoiceDate;
    private Double totalAmount;


    @Enumerated(EnumType.STRING)
    private InvoiceStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // N-1 con User

    @ManyToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address; // N-1 con Address

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products; // 1-N con Product

}
