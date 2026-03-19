import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) { }

  async getPerformanceRanking() {
    const students = await this.prisma.student.findMany({
      include: { user: true, scores: { where: { score: { not: null } } } },
    });

    const ranked = students
      .map((student) => {
        const scores = student.scores.map((sc) => sc.score as number);
        const totalScores = scores.length;

        // if (totalScores < 5) return null; // kamida 5 score (5 ta darsda qatnashish) kerak ranking jadvalga chiqishi uchun

        const avgScore = scores.reduce((a, b) => a + b, 0) / totalScores;
        const rankScore = avgScore * Math.log(totalScores + 1);

        return {
          id: student.id,
          name: student.user.fullname,
          level: student.level,
          avgScore,
          totalScores,
          rankScore,
        };
      })
      .filter((student): student is NonNullable<typeof student> => student !== null)
      .sort((a, b) => b.rankScore - a.rankScore);

    return { data: ranked }
  }

  // Coins ranking
  async getCoinsRanking() {
    const students = await this.prisma.student.findMany({ include: { user: true } });

    return students
      .map((student) => ({ id: student.id, name: student.user.fullname, coins: student.user.coins }))
      .sort((a, b) => b.coins - a.coins);
  }
}