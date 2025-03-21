package Hewwwe.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;
    private String street;
    private String number;
    private String city;
    private String country;
    private String postalCode;

    // Relación
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // N-1 con User


}
