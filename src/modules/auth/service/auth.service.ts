import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { AuthData, AuthInput } from '../model';

@Injectable()
export class AuthService {
    public constructor(private readonly prisma: PrismaService) { }


    public async createUser(data: AuthInput): Promise<AuthData> {
        const user = await this.prisma.user.create({ data });
        return new AuthData(user);
    }
}
