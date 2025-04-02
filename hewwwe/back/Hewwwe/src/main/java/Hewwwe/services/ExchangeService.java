package Hewwwe.services;

import Hewwwe.entity.Exchange;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ExchangeService {
    Exchange createExchange(Exchange exchange);
    Exchange getExchangeById(Long id);
    Exchange updateExchange(Exchange exchange);
    void deleteExchange(Long id);
    List<Exchange> getAllExchanges();
    List<Exchange> getExchangesByRequesterId(Long requesterId);
    List<Exchange> getExchangesByOwnerId(Long ownerId);
    Exchange updateExchangeStatus(Long id, String status);
}
