package Hewwwe.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración de CORS (Cross-Origin Resource Sharing) para la aplicación.
 * Esta clase permite configurar los permisos de acceso para peticiones
 * realizadas desde diferentes orígenes.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Configura las políticas CORS para la aplicación.
     * Define los orígenes permitidos, métodos HTTP, cabeceras y credenciales
     * para las peticiones cross-origin.
     *
     * @param registry El registro donde se configuran las políticas CORS
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // Vite default port
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
