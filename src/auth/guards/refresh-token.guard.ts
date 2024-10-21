import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const UseRefreshTokenGuard = () => UseGuards(RefreshTokenGuard);

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}
