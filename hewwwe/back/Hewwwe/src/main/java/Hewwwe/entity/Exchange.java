package Hewwwe.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "exchange")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Exchange {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long exchangeId;
    private String status;
    private Date exchangeDate;
    private Date completionDate;

    // Relaciones
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester; // N-1 con User

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner; // N-1 con User

    @JsonIgnore
    @OneToMany(mappedBy = "exchange", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products; // 1-N con Product

}
