import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  async getPerformanceRanking() {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      include: {
        student: {
          include: { scores: { where: { score: { not: null } } } },
        },
      },
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
    const user = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!user) throw new Error('Student not found');

    const allRanking = await this.getPerformanceRanking();

    const myLevelRanking = allRanking.data.filter(
      (item) => item.level === user.level,
    );

    const myIndex = myLevelRanking.findIndex((item) => item.userId === userId);

    if (myIndex === -1) {
      return { data: null, message: 'User not found in this level' };
    }

    const me = myLevelRanking[myIndex];

    return { data: { ...me, rank: myIndex + 1 } };
  }
}
