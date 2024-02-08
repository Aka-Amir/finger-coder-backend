import { PartialType } from '@nestjs/mapped-types';
import { CreateSponserDto } from './create-sponser.dto';

export class UpdateSponserDto extends PartialType(CreateSponserDto) {}
