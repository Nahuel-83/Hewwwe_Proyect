package Hewwwe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeResponseDTO {
    Long exchangeId;
    String status;
    Date exchangeDate;
    Date completionDate;
    Long requesterId;
    Long ownerId;
    List<Long> productIds;
}
