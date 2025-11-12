import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
  })],
})

export class AuthModule { }