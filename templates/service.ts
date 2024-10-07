import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common';

@Injectable()
export class ----Service {
    public constructor(private readonly prismaService: PrismaService) { }


}
