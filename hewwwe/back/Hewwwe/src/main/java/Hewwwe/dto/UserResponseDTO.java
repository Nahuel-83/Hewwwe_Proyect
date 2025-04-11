package Hewwwe.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO{
        Long productId;
        String name;
        String email;
        String phone;
        String role;
        Date registrationDate;
        String oauthToken;
}