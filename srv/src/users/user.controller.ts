import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import {UsersResponseDto} from "./users.response.dto";

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getUsersPaginated(@Query() query: any) {
    this.logger.log('Get users paginated');
    const usersPaginated = await this.userService.findPaginated(query);
    return usersPaginated;
  }
}
