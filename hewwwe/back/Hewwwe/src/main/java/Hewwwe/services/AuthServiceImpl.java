package Hewwwe.services;

import Hewwwe.dto.LoginResponse;
import Hewwwe.entity.User;
import Hewwwe.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;

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
}
