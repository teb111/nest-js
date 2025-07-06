import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query-dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    //injecting Requests
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const results = await repository.find({
      skip: (paginationQuery.page - 1) * paginationQuery.limit,
      take: paginationQuery.limit,
    });

    //create requrest urls
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';
    console.log('Base URL:', baseUrl);
    const newUrl = new URL(this.request.url, baseUrl);
    console.log('New URL:', newUrl);

    //calculate page numbers
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / paginationQuery.limit);
    const nextPage =
      paginationQuery.page === totalPages
        ? paginationQuery.page
        : paginationQuery.page + 1;
    const previousPage =
      paginationQuery.page === 1
        ? paginationQuery.page
        : paginationQuery.page - 1;
    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: paginationQuery.limit,
        currentPage: paginationQuery.page,
        totalItems: totalItems,
        totalPages: totalPages,
      },
      links: {
        first:
          newUrl.origin +
          newUrl.pathname +
          `?page=1&limit=${paginationQuery.limit}`,
        last:
          newUrl.origin +
          newUrl.pathname +
          `?page=${totalPages}&limit=${paginationQuery.limit}`,
        current:
          newUrl.origin +
          newUrl.pathname +
          `?page=${paginationQuery.page}&limit=${paginationQuery.limit}`,
        next:
          newUrl.origin +
          newUrl.pathname +
          `?page=${nextPage}&limit=${paginationQuery.limit}`,
        previous:
          newUrl.origin +
          newUrl.pathname +
          `?page=${previousPage}&limit=${paginationQuery.limit}`,
      },
    };
    return finalResponse;
  }
}
