export type LoginDTO = {
    username: string;
    password: string;
}

export type SignUpDTO = {
    username: string;
    password: string;
    email: string;
    phone: string;
    dob: Date;
    gender: number;
}