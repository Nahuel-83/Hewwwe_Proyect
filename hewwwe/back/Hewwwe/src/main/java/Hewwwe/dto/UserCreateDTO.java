package Hewwwe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCreateDTO{
        @NotBlank(message = "Name is required")
        String name;
        
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email;
        
        @NotBlank(message = "Phone is required")
        String phone;
        
        @NotBlank(message = "Role is required")
        String role;
        
        @NotNull(message = "Registration date is required")
        Date registrationDate;
        
        String oauthToken;
}
