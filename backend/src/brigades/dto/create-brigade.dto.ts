import { Priority } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBrigadeDto {
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsOptional()
    @IsEnum(Priority)
    priority?:Priority;

    @IsOptional()
    @IsString()
    needs?:string;
}
