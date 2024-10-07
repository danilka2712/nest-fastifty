import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common';

@Injectable()
export class StockService {
    public constructor(private readonly prismaService: PrismaService) { }


}
