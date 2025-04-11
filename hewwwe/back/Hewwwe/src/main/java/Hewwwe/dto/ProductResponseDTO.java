package Hewwwe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponseDTO{
        Long productId;
        String name;
        String description;
        Double price;
        String image;
        String size;
        String status;
        Date publicationDate;
        Long userId;
        Long categoryId;
        Long cartId;
        Long exchangeId;
}
