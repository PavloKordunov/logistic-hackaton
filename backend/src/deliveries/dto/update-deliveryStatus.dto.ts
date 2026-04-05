import { DeliveryStatus } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class UpdateDeliveryDto{
    @IsEnum(DeliveryStatus)
    @IsString()
    status:DeliveryStatus;
}