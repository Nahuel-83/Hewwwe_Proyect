package Hewwwe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeDTO {
    private Long exchangeId;
    private String status;
    private Date exchangeDate;
    private Date completionDate;
    private Long requesterId;
    private Long ownerId;
    private List<Long> productIds;
}
