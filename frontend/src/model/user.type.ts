export type UserLoginDTO = {
    username: string;
    password: string;
}

export type UserSignUpDTO = {
    username: string;
    password: string;
    email: string;
}

export type Profile = {
    phone: string;
    dob: Date;
    gender: number;
}