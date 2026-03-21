import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';

@Module({
  providers: [StudentService, PrismaService],
  controllers: [StudentController],
})
export class StudentModule {}
