import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Score, AttendanceStatus, Prisma } from '@prisma/client';

interface StudentScore {
  studentId: string;
  score?: number;
}

@Injectable()
export class ScoreService {
  constructor(private prisma: PrismaService) { }

  async submitScores(
    courseId: string,
    date: Date,
    students: StudentScore[],
  ): Promise<Score[]> {
    const results: Score[] = [];
    const existingScores = await this.prisma.score.findFirst({
      where: {
        courseId,
        date,
      },
    });

    if (existingScores) {
      throw new BadRequestException('Scores are already submitted for this course on this date!');
    }

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const student of students) {
        const enrollment = await tx.course.findFirst({
          where: {
            id: courseId,
            students: { some: { id: student.studentId } },
          },
        });

        if (!enrollment) {
          throw new BadRequestException("Student is not enrolled in the course");
        }

        const scoreRecord = await this.createOrUpdateScore(tx, courseId, date, student);
        results.push(scoreRecord);
      }
    });

    return results;
  }

  async getCourseScores(courseId: string) {
    const courseScores = await this.prisma.score.findMany({
      where: { courseId },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    return { data: courseScores };
  }

  async deleteScores() {
    await this.prisma.score.deleteMany()
  }

  private async createOrUpdateScore(
    tx: Prisma.TransactionClient,
    courseId: string,
    date: Date,
    student: StudentScore,
  ): Promise<Score> {
    const attendance =
      student.score && student.score > 0
        ? AttendanceStatus.PRESENT
        : AttendanceStatus.ABSENT;

    const existing = await tx.score.findUnique({
      where: { studentId_courseId_date: { studentId: student.studentId, courseId, date } },
    });

    if (existing) {
      return tx.score.update({
        where: { id: existing.id },
        data: { score: student.score ?? null, attendance },
      });
    }

    return tx.score.create({
      data: {
        studentId: student.studentId,
        courseId,
        date,
        score: student.score ?? null,
        attendance,
      },
    });
  }
}