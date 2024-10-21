import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from './serialize.interface';
import { SerializeInterceptor } from './serialize.interceptor';

export const UseSerialize = (Dto: ClassConstructor) => UseInterceptors(new SerializeInterceptor(Dto));
