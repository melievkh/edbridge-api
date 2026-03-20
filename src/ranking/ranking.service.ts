import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) { }

  async getPerformanceRanking() {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      include: {
        student: {
          include: { scores: { where: { score: { not: null } } } }
        }
      }
    });

    const ranked = users
      .map((user) => {
        const student = user.student;
        if (!student) return null;

        const scores = student.scores.map((sc) => sc.score as number);
        const totalScores = scores.length;
        if (totalScores === 0) return null;

        const avgScore = scores.reduce((a, b) => a + b, 0) / totalScores;
        const rankScore = avgScore * Math.log(totalScores + 1);

        if (!rankScore || rankScore === 0) return null;

        return {
          userId: user.id,
          fullname: user.fullname,
          level: student.level,
          avgScore,
          totalScores,
          rankScore,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.rankScore - a.rankScore);

    return { data: ranked };
  }

  async getMyRanking(userId: string) {
    const allRanking = await this.getPerformanceRanking();
    const myIndex = allRanking.data.findIndex(item => item.userId === userId);

    const me = allRanking.data[myIndex];

    return { data: { ...me, rank: myIndex + 1 } };
  }
}