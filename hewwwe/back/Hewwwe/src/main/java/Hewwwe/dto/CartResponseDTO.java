package Hewwwe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO{
    Long cartId;
    Date cartDate;
    String status;
    Long userId;
    List<Long> productIds;
}
