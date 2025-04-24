package Hewwwe.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Clase de configuración para la aplicación Hewwwe.
 * Esta clase proporciona beans y configuraciones para la aplicación.
 * Incluye la configuración para ModelMapper y la documentación OpenAPI.
 */
@Configuration
@OpenAPIDefinition
public class AppConfig {

    /**
     * Crea y configura un bean ModelMapper.
     * ModelMapper se utiliza para mapear entre objetos DTO y entidades.
     *
     * @return Una instancia configurada de ModelMapper
     */
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    /**
     * Configura la documentación OpenAPI para la API.
     * Este método establece la información básica sobre la API incluyendo
     * título, versión y descripción.
     *
     * @return Una instancia de OpenAPI configurada con información personalizada
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hewwwe API")
                        .version("1.0")
                        .description("API para el mercado de ropa de segunda mano"));
    }
}
