import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

type Paginate<T> = {
  data: T[];
  total: number;
  page: number;
  size: number;
};

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users
  async findAll(): Promise<UsersEntity[]> {
    return await this.usersRepo.find();
  }
  async findPaginated(query): Promise<Paginate<UsersEntity>> {
    const { page = 1, size = 10 } = query;
    const [ result, total ] = await this.usersRepo.findAndCount({
      take: size,
      skip: Math.max(page - 1, 0) * size,
    });
    return {
      data: result,
      total,
      page,
      size,
    };
  }
}
