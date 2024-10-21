import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const UseLocalGaurd = () => UseGuards(LocalGaurds);

@Injectable()
export class LocalGaurds extends AuthGuard('local') {}
