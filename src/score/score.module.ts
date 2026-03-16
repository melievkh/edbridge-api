import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';

@Module({
  providers: [ScoreService, PrismaService],
  controllers: [ScoreController],
})

export class ScoreModule { }