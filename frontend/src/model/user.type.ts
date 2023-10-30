export type UserLoginDTO = {
    username: string;
    password: string;
}

export type UserSignUpDTO = {
    username: string;
    password: string;
    email: string;
    phone: string;
    dob: Date;
    gender: number;
}