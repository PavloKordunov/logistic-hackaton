import { PartialType } from '@nestjs/mapped-types';
import { CreateBrigadeDto } from './create-brigade.dto';

export class UpdateBrigadeDto extends PartialType(CreateBrigadeDto) {}
