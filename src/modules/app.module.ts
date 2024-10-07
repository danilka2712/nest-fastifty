import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common';
import { PassengerModule } from './passenger/passenger.module';

@Module({
    imports: [
        AuthModule,
        CommonModule,
        PassengerModule
    ]
})
export class ApplicationModule {}
