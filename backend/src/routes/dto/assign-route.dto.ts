import { IsArray, IsIn, IsNotEmpty, IsString } from "class-validator";

export class AssignRouteDto {
   @IsString()
   @IsNotEmpty()
   vehicleId:string;

   @IsArray()
   @IsString({each:true})
   @IsNotEmpty()
   deliveryIds:string[];
}
