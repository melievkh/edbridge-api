import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';

@Module({
  providers: [PrismaService, RankingService],
  controllers: [RankingController],
})
export class RankingModule { }