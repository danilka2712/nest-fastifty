import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
    imports: [CommonModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
