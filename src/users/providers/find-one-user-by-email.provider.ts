import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  public async findOneByEmail(email: string): Promise<User | null> {
    let user: User | null = null;
    try {
      user = await this.usersRepository.findOne({
        where: { email },
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
    if (!user) {
      throw new UnauthorizedException('User not found with this email.');
    }

    return user;
  }
}
