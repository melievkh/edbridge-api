import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, BadRequestException, } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) { }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone }
    });
    if (!user) { throw new BadRequestException('Invalid phone or password'); }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid password');

    return this.generateTokens(user.id, user.role);
  }

  async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };

    return { accessToken: await this.jwt.signAsync(payload) };
  }
}
