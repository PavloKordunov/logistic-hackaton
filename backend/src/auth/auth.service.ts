import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './Dto/loginDto'; 
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service'; 
import { refreshTokenDto } from './Dto/RefreshTokenDto';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService, 
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService 
    ) {}

    async validate(dto: loginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });

        if (!user) {
            throw new NotFoundException("Користувача не знайдено");
        }

        const isPasswordCompare = await bcrypt.compare(dto.password, user.password);

        if (user && isPasswordCompare) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(dto: loginDto) {
        const user = await this.validate(dto);
        if (!user) {
            throw new UnauthorizedException("Невірний email або пароль");
        }
        const token = await this.generateTokens(user.id, user.email);

        const hashedTokens = await bcrypt.hash(token.refreshToken, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: { hashedRefreshToken: hashedTokens }
        });
        
        return {
            user,
            token: token
        };
    }

    private async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };
        const secret = this.configService.get<string>('JWT_SECRET');

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                expiresIn: '15m', 
                secret: secret 
            }),
            this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: secret 
            })
        ]);
        return { accessToken, refreshToken };
    }

    async refresh(dto: refreshTokenDto) {
        try {
            const payload = await this.jwtService.verifyAsync(dto.refreshToken, {
                secret: this.configService.get<string>('JWT_SECRET') 
            });
            
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub }
            });
            
            if (!user || !user.hashedRefreshToken) {
                throw new UnauthorizedException("Access denied");
            }
            
            const compareTokens = await bcrypt.compare(dto.refreshToken, user.hashedRefreshToken);
            if (!compareTokens) {
                throw new UnauthorizedException("Access denied");
            }

            const tokens = await this.generateTokens(user.id, user.email);
            const refreshedNewHashedTokens = await bcrypt.hash(tokens.refreshToken, 10);
            
            await this.prisma.user.update({
                where: { id: user.id },
                data: { hashedRefreshToken: refreshedNewHashedTokens }
            });
            return tokens;
        } catch (error) {
            throw new UnauthorizedException("Invalid or Expired Refresh Token");
        }
    }

    async logout(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: null }
        });
    }
}