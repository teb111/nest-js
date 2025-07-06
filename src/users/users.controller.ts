import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Get users with optional pagination',
  })
  @Get()
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
  ) {
    return this.usersService.getUsers(getUsersParamDto, limit, page);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('create-many')
  public createManyUsers(@Body() CreateManyUsersDt: CreateManyUsersDto) {
    return this.usersService.createMany(CreateManyUsersDt);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'User updated successfully';
  }
}
