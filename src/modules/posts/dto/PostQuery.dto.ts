import { Transform, Type } from 'class-transformer';
import { IsDate, IsDefined, IsOptional } from 'class-validator';

export class postQueryDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  endDate?: Date;
}
