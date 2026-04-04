
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateVehicleDto {
    @IsNumber()
    @IsNotEmpty()
    lat?:number;

    @IsNumber()
    @IsNotEmpty()
    ltg:number;
}
