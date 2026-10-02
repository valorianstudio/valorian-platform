import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AdminProfile, AdminUsersService } from '../admin-users/admin-users.service';
import { LoginDto } from './dto/login.dto';

const INVALID_CREDENTIALS = 'Invalid email or password.';

@Injectable()
export class AuthService {
  private dummyHash?: Promise<string>;

  constructor(
    private readonly users: AdminUsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ token: string; user: AdminProfile }> {
    const found = await this.users.findByEmail(dto.email);
    // Verify against a dummy hash for unknown accounts so response timing does not reveal them.
    const hash = found?.passwordHash ?? (await this.getDummyHash());
    const valid = await argon2.verify(hash, dto.password);
    if (!found || !valid || !found.isActive) throw new UnauthorizedException(INVALID_CREDENTIALS);

    const user = await this.users.markLoggedIn(found.id);
    return { token: await this.jwt.signAsync({ sub: user.id }), user };
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= argon2.hash('valorian-dummy-password');
    return this.dummyHash;
  }
}
