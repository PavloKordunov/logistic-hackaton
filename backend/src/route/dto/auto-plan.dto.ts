import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class AutoPlanTargetDto {
  @IsString()
  @IsNotEmpty()
  brigadeId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class AutoPlanDto {
  @IsString()
  @IsNotEmpty()
  resourceName: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AutoPlanTargetDto)
  targets: AutoPlanTargetDto[];
}
