package Hewwwe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String name;
    private String description;
    private Double price;
    private String image;
    private String size;
    private String status;
    private Date publicationDate;
    private Long userId;
    private Long categoryId;
    private Long cartId;
    private Long exchangeId;
}
