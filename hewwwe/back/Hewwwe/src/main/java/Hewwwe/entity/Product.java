package Hewwwe.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "product")
@Getter
@Setter
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
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // N-1 con User

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category; // N-1 con Category

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart; // N-1 con Cart

    @ManyToOne
    @JoinColumn(name = "exchange_id")
    private Exchange exchange; // N-1 con Exchange


}
