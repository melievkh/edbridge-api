import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import appConfig from './config/app.config';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { TeacherModule } from './teacher/teacher.module';
import { SubjectModule } from './subject/subject.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    StudentModule,
    UserModule,
    CourseModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [appConfig],
    }),
    TeacherModule,
    SubjectModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
