import { Controller, Get, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
  constructor(private rankingService: RankingService) { }

  @Get('performance')
  getPerformance() {
    return this.rankingService.getPerformanceRanking();
  }

  @Get('coins')
  getCoins() {
    return this.rankingService.getCoinsRanking();
  }
}