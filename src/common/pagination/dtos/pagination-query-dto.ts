import { IsOptional, IsPositive, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsPositive()
  @Min(1)
  page: number = 1;

  total?: number;
  totalPages?: number;
}
