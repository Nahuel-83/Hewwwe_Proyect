package Hewwwe.services;

import Hewwwe.entity.Exchange;
import Hewwwe.exception.ResourceNotFoundException;
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
        return exchangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found with id: " + id));
    }

    @Override
    public Exchange updateExchange(Exchange exchange) {
        if (!exchangeRepository.existsById(exchange.getExchangeId())) {
            throw new ResourceNotFoundException("Exchange not found with id: " + exchange.getExchangeId());
        }
        return exchangeRepository.save(exchange);
    }

    @Override
    public void deleteExchange(Long id) {
        if (!exchangeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Exchange not found with id: " + id);
        }
        exchangeRepository.deleteById(id);
    }

    @Override
    public List<Exchange> getAllExchanges() {
        return exchangeRepository.findAll();
    }

    @Override
    public List<Exchange> getExchangesByRequesterId(Long requesterId) {
        return exchangeRepository.findByRequester_UserId(requesterId);
    }

    @Override
    public List<Exchange> getExchangesByOwnerId(Long ownerId) {
        return exchangeRepository.findByOwner_UserId(ownerId);
    }

    @Override
    public Exchange updateExchangeStatus(Long id, String status) {
        Exchange exchange = getExchangeById(id);
        exchange.setStatus(status);
        return exchangeRepository.save(exchange);
    }
}
