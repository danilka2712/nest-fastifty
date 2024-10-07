import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class AuthData {

    public static readonly NAME_LENGTH = 50;

    @ApiProperty({ description: 'Passenger unique ID', example: '36635263' })
    public readonly id: number;

    @ApiProperty({ description: 'First name', example: 'John' })
    public readonly email: string;

    @ApiProperty({ description: 'Last name', example: 'Doe' })
    public readonly password: string;

    public constructor(entity: User) {
        this.id = entity.id;
        this.email = entity.email;
        this.password = entity.password;
    }

}
