package com.ductm.imagesPost.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserSignUpDTO {
    private String username;
    private String password;
    private String email;
    private String phone;
    private Date dob;
    private Byte gender;
}
