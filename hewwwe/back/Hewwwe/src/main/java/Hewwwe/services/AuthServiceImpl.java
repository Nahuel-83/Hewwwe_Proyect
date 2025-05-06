package Hewwwe.services;

import Hewwwe.dto.LoginResponse;
import Hewwwe.dto.RegisterRequest;
import Hewwwe.entity.User;
import Hewwwe.entity.enums.Rol;
import Hewwwe.entity.Address;
import Hewwwe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userRepository.findByUsernameOrEmail(username, username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            log.info("Usuario encontrado: {}", user.getUsername());
            return new LoginResponse(true, user, "Login exitoso");
        } catch (Exception e) {
            log.error("Error en login: ", e);
            throw new RuntimeException("Error en la autenticación");
        }
    }

    @Override
    public User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Override
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo ya está en uso");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        Address address = new Address();
        address.setStreet(request.getAddress().getStreet());
        address.setNumber(request.getAddress().getNumber());
        address.setCity(request.getAddress().getCity());
        address.setCountry(request.getAddress().getCountry());
        address.setPostalCode(request.getAddress().getPostalCode());

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.getAddresses().add(address);
        address.setUser(user); 
        user.setRole(Rol.USER);
        User savedUser = userRepository.save(user);
        log.info("Usuario registrado: {}", savedUser.getUsername());
        return savedUser;
    }
}
