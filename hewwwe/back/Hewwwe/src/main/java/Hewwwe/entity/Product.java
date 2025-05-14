package Hewwwe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "product")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    private String name;
    private String description;
    private Double price;
    private String image;
    private String size;
    private String status;
    private Date publicationDate;

    // Relaciones
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // N-1 con User

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // N-1 con Category

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart; // N-1 con Cart
    
    @JsonIgnore
    @ManyToMany(mappedBy = "products")
    private List<Exchange> exchanges = new ArrayList<>(); // N-M con Exchange

    // Relación con la factura
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice; // N-1 con Invoice
}
