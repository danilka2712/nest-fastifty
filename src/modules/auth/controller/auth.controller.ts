import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { LoggerService } from '../../common';
import { AuthPipe } from '../flow/auth.pipe';
import { AuthData, AuthInput } from '../model';
import { AuthService } from '../service/auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    public constructor(
        private readonly logger: LoggerService,
        private readonly authService: AuthService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Создать пользователя' })
    @ApiResponse({ status: HttpStatus.CREATED, type: AuthData })
    public async createUser(@Body(AuthPipe) input: AuthInput): Promise<AuthData> {
        this.logger.info('Creating new user');
        const user = await this.authService.createUser(input);
        this.logger.info(`Created new user with ID ${user.id}`);
        return user;
    }


    @Post('sign_in')
    public signIn() {
        const env = process.env;

        const payload = { role: 'restricted' };
        const token = jwt.sign(
            payload,
            `${env.JWT_SECRET}`,
            {
                expiresIn: '1h'
            }
        );

        return { access_token: token };

    }

    @Post('test')
    @HttpCode(HttpStatus.CREATED)
    public test() {
        return 'Это тестовый ответ';
    }
}
