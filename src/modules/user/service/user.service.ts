import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common';

@Injectable()
export class UserService {
    public constructor(private readonly prismaService: PrismaService) { }


}
