package Hewwwe.services;

import Hewwwe.entity.Exchange;
import Hewwwe.repository.ExchangeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExchangeServiceImpl implements ExchangeService {

    private final ExchangeRepository exchangeRepository;

    @Override
    public Exchange createExchange(Exchange exchange) {
        return exchangeRepository.save(exchange);
    }

    @Override
    public Exchange getExchangeById(Long id) {
        return exchangeRepository.findById(id).orElseThrow(() -> new RuntimeException("Exchange not found"));
    }

    @Override
    public Exchange updateExchange(Exchange exchange) {
        return exchangeRepository.save(exchange);
    }

    @Override
    public void deleteExchange(Long id) {
        exchangeRepository.deleteById(id);
    }

    @Override
    public List<Exchange> getAllExchanges() {
        return exchangeRepository.findAll();
    }
}
