import { IsEmail, IsNotEmpty, IsNumber, MinLength } from "class-validator";

export class loginDto{
    @IsNotEmpty()
    @IsEmail()
    email:string

    @IsNumber()
    @MinLength(6)
    password:string
}