import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };

    return { accessToken: await this.jwt.signAsync(payload) };
  }

  async loginUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (!user) throw new BadRequestException('Login or password is incorrect');
    if (!user.isActive)
      throw new BadRequestException('User is not active! Contact with admin');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch)
      throw new BadRequestException('Login or password is incorrect');

    return this.generateTokens(user.id, user.role);
  }
}
