import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsUrl,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Method } from '../enums/method.enum';

export class CreateApiCollectionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Method)
  method: Method;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsObject()
  headers?: Record<string, any>;

  @IsOptional()
  @IsObject()
  body?: Record<string, any>;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}
