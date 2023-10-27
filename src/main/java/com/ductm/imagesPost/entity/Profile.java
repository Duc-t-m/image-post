package com.ductm.imagesPost.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Profile implements Serializable {
    @OneToOne
    @MapsId
    @JoinColumn(name = "account_id", nullable = false)
    @Id
    private Account account;

    private String phone;
    private Date dob;
    private Byte gender;
}
