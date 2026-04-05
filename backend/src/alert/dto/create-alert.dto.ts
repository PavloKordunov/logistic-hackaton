import { IsNotEmpty, IsString } from "class-validator";

export class CreateAlertDto {
    @IsString()
    @IsNotEmpty()
    brigadeId:string;

    @IsString()
    @IsNotEmpty()
    message:string;
}
