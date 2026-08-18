import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../user/schemas/user.schema';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwt: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new UnauthorizedException('Email already registered');
    }
    const user = await this.users.create(dto.email, dto.password, dto.role ?? UserRole.OWNER, dto.name);
    return {
      token: this.signToken(user.id, user.email, user.role),
      user,
    };
  }

  async login(dto: LoginDto) {
    const found = await this.users.findByEmail(dto.email);
    if (!found) throw new UnauthorizedException('Invalid credentials');
    const ok = await this.users.validatePassword(dto.password, found.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const user = this.users.toSafeUser({ ...found, _id: found._id });
    return {
      token: this.signToken(user.id, user.email, user.role),
      user,
    };
  }

  private signToken(id: string, email: string, role: string) {
    const payload: JwtPayload = { sub: id, email, role };
    return this.jwt.sign(payload);
  }
}
