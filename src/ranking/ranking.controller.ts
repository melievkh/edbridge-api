import { Body, Controller, Get, Request } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
  constructor(private rankingService: RankingService) {}

  @Get()
  getPerformance() {
    return this.rankingService.getPerformanceRanking();
  }

  @Get('me')
  getMyRanking(@Request() req) {
    return this.rankingService.getMyRanking(req.user.userId);
  }
}
