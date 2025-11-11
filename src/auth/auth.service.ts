import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable, UnauthorizedException, NotFoundException, BadRequestException,
  HttpException,
} from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) { }

  async login(dto) {

    try {
      const user = await this.prisma.user.findUnique({
        where: { phone: dto.phone }
      });
      if (!user) throw new UnauthorizedException('Invalid phone or password');

      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) throw new BadRequestException('Invalid password');

      return this.generateTokens(user.id, user.role);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to login user', 500);
    }
  }

  async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };

    return {
      accessToken: await this.jwt.signAsync(payload),
    };
  }
}
