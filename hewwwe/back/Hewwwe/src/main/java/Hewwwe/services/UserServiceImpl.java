package Hewwwe.services;

import Hewwwe.entity.Address;
import Hewwwe.entity.Cart;
import Hewwwe.entity.Exchange;
import Hewwwe.entity.Product;
import Hewwwe.entity.User;
import Hewwwe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public User update(Long id, User user) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setName(user.getName());
            existingUser.setEmail(user.getEmail());
            existingUser.setPhone(user.getPhone());
            existingUser.setRole(user.getRole());
            existingUser.setRegistrationDate(user.getRegistrationDate());
            existingUser.setOauthToken(user.getOauthToken());

            // Relaciones
            existingUser.setCart(user.getCart());
            existingUser.setAddresses(user.getAddresses());
            existingUser.setProducts(user.getProducts());
            existingUser.setExchanges(user.getExchanges());

            return userRepository.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Cart getCartByUserId(Long userId) {
        return userRepository.findById(userId).map(User::getCart).orElse(null);
    }

    public List<Address> getAddressesByUserId(Long userId) {
        return userRepository.findById(userId).map(User::getAddresses).orElse(List.of());
    }

    public List<Product> getProductsByUserId(Long userId) {
        return userRepository.findById(userId).map(User::getProducts).orElse(List.of());
    }

    public List<Exchange> getExchangesByUserId(Long userId) {
        return userRepository.findById(userId).map(User::getExchanges).orElse(List.of());
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}
