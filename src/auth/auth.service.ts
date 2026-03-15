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

  async generateLogin() {
    let login = "";
    for (let i = 0; i < 11; i++) {
      login += Math.floor(Math.random() * 10);
    }
    // Ensure the first digit is not zero
    if (login[0] === "0") {
      login = "1" + login.slice(1);
    }
    return login;
  }


  async loginUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login }
    });
    if (!user) { throw new BadRequestException('Invalid login or password'); }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid password');

    return this.generateTokens(user.id, user.role);
  }

  async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };

    return { accessToken: await this.jwt.signAsync(payload) };
  }
}
