import { Module } from '@nestjs/common';

import { CommonModule } from '../common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
    imports: [
        CommonModule,
    ],
    providers: [
        UserService
    ],
    controllers: [
        UserController
    ],
    exports: []
})
export class UserModule { }
