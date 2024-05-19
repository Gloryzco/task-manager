import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RefreshTokenDto } from '../dtos';
import * as argon from 'argon2';
import { IAccessToken, IJwtPayload, IRefreshToken } from 'src/shared';
import AppError from 'src/shared/utils/app-error.utils';
import { UserService } from 'src/module/user';
import configuration from 'src/config/configuration';

const config = configuration();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(
    userId: string,
    email: string,
  ): Promise<IAccessToken> {
    const jwtPayload: IJwtPayload = {
      sub: userId,
      email: email,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: config.jwt.accessTokenSecret,
      expiresIn: config.jwt.accessTokenExpiration,
    });

    return {
      accessToken: accessToken,
      accessTokenExpiresIn: config.jwt.accessTokenExpiration,
    };
  }

  async generateRefreshTokens(
    userId: string,
    email: string,
  ): Promise<IRefreshToken> {
    const jwtPayload: IJwtPayload = {
      sub: userId,
      email: email,
    };

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: config.jwt.refreshTokenSecret,
      expiresIn: config.jwt.refreshTokenExpiration,
    });

    return {
      refreshToken: refreshToken,
      refreshTokenExpiresIn: config.jwt.refreshTokenExpiration,
    };
  }

  async refreshToken(payload: RefreshTokenDto) {
    console.log(payload.refreshToken);
    // const { sub, email } = (await this.jwtService.verify(
    //   payload.refreshToken,
    //   config.jwt.refreshToken_secret as string,
    // )) as IJwtPayload;

    const { sub, email } = await this.jwtService.verifyAsync<IJwtPayload>(
      payload.refreshToken,
      { secret: config.jwt.refreshTokenSecret },
    );

    const user = await this.userService.findById(sub);

    if (!user) {
      throw new AppError('0002', 'Invalid refresh token');
    }

    // const refreshTokenMatches = await argon.verify(
    //   user.refreshToken,
    //   refreshToken as any,
    // );
    // if (!refreshTokenMatches) {
    //   throw new AppError('0005', 'Access denied.');
    // }

    const accessToken = await this.generateAccessToken(sub, email);
    // await this.updateRefreshToken(user.id, tokens.refreshToken);

    return accessToken;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async login(loginDto: LoginDto): Promise<IAccessToken | IRefreshToken> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new AppError('0002', 'User not found');
    }
    // const verifyPassword = await argon.verify(user.password, password);
    const verifyPassword = await user.correctPassword(password, user.password);

    if (!verifyPassword) {
      throw new AppError('0002', 'invalid credentials');
    }

    const accessTokenDetails = await this.generateAccessToken(
      user.id,
      user.email,
    );
    const refreshTokenDetails = await this.generateRefreshTokens(
      user.id,
      user.email,
    );

    const tokens = { ...accessTokenDetails, ...refreshTokenDetails };
    await this.updateRefreshToken(user.id, refreshTokenDetails.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new AppError('0005', 'Record Not Found.');
    }

    await this.userService.update(userId, { refreshToken: null });

    return true;
  }
}
