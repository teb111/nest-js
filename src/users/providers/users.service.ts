import { Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';

import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // Inectinging config service
    private readonly configService: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly ProfileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }
  public getUsers(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    // const environment = this.configService.get<string>('MY_BUCKET');
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
}
