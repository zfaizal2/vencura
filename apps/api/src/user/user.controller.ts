import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '@repo/api/user/dto/create-user.dto';
import { UserService } from './user.service';
import { AuthId, AuthEmail } from './user.decorator';
import { DEFAULT_AUTH_METHOD } from 'src/consts';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto, @AuthId() authId: string, @AuthEmail() authEmail: string) {
        const user = {
            auth_id: authId,
            auth_method: DEFAULT_AUTH_METHOD,
            email: authEmail,
            name: createUserDto.name,
        }
        return this.userService.createUser(user);
    }
}
    