import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';

import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    //create query runner instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to connect to database, please try again later.',
        {
          description: String(error),
        },
      );
    }

    try {
      for (const user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        newUser = await queryRunner.manager.save(newUser);
        newUsers.push(newUser);
      }
      await queryRunner.commitTransaction();
      return newUsers;
    } catch (error: any) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        'Could not complete the operation, please try again later.',
        {
          description: String(error),
        },
      );
    } finally {
      try {
        await queryRunner.release();
      } catch (error) {
        console.log('Error releasing query runner:', error);
      }
    }
  }
}
