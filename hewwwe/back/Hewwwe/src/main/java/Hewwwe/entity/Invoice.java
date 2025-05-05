package Hewwwe.entity;

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
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceId;
    
    private Date invoiceDate;
    private Double totalAmount;
    
    @ManyToOne
    @JoinColumn(name = "address_id")
    private Address address;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @OneToMany(mappedBy = "invoice")
    private List<Product> products;
}
