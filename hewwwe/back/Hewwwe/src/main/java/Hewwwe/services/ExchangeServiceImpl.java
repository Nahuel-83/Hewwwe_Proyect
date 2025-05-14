package Hewwwe.services;

import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import Hewwwe.exception.ResourceNotFoundException;
import Hewwwe.repository.ExchangeRepository;
import Hewwwe.repository.ProductRepository;
import Hewwwe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExchangeServiceImpl implements ExchangeService {

    private final ExchangeRepository exchangeRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

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

    @Override
    public Exchange proposeExchange(Long ownerId, Long requesterId, Long ownerProductId, Long requesterProductId) {
        // Obtener los usuarios
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));
        
        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found with id: " + requesterId));
        
        // Obtener los productos
        Product ownerProduct = productRepository.findById(ownerProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner product not found with id: " + ownerProductId));
        
        Product requesterProduct = productRepository.findById(requesterProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester product not found with id: " + requesterProductId));
        
        // Validar que los productos pertenezcan a los usuarios correctos
        if (!ownerProduct.getUser().getUserId().equals(ownerId)) {
            throw new IllegalArgumentException("Owner product does not belong to the specified owner");
        }
        
        if (!requesterProduct.getUser().getUserId().equals(requesterId)) {
            throw new IllegalArgumentException("Requester product does not belong to the specified requester");
        }
        
        // Crear el intercambio
        Exchange exchange = new Exchange();
        exchange.setExchangeDate(new Date());
        exchange.setStatus("PENDING");
        exchange.setOwner(owner);
        exchange.setRequester(requester);
        
        // Guardar el intercambio primero para que tenga un ID
        exchange = exchangeRepository.save(exchange);
        
        // Añadir los productos al intercambio
        List<Product> products = new ArrayList<>();
        products.add(ownerProduct);
        products.add(requesterProduct);
        exchange.setProducts(products);
        
        // Actualizar también la relación bidireccional
        ownerProduct.getExchanges().add(exchange);
        requesterProduct.getExchanges().add(exchange);
        
        // Guardar el intercambio actualizado
        return exchangeRepository.save(exchange);
    }
}
