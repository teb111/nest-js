import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';

import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // Inectinging config service
    private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly ProfileConfiguration: ConfigType<typeof profileConfig>,

    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null;
    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Unable to connect to database, please try again later.',
        {
          description: 'Database connection error',
        },
      );
    }
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }
    let newUser = this.usersRepository.create(createUserDto);
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Unable to connect to database, please try again later.',
        {
          description: 'Database connection error',
        },
      );
    }

    return newUser;
  }
  public getUsers(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'This endpoint is deprecated, please use /v2/users instead.',
        fileName: 'users.service.ts',
        lineNumber: 70,
      },
      HttpStatus.MOVED_PERMANENTLY,
    );
    console.log(this.ProfileConfiguration);
    console.log(getUsersParamDto, limit, page);
    return [
      {
        id: 1,
        name: 'John Doe',
      },
      {
        id: 2,
        name: 'Jane Doe',
      },
    ];
  }

  public async getUserById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }
}
