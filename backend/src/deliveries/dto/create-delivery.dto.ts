import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateDeliveryDto {
    @IsString()
    @IsNotEmpty()
    brigadeId:string;

    @IsString()
    @IsNotEmpty()
    resourceId:string;

    @IsInt()
    @IsNotEmpty()
    @Min(1)
    quantity:number;
}
