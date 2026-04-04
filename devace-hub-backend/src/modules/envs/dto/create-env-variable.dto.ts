import { IsNotEmpty, IsString, Matches, IsUUID } from 'class-validator';

export class CreateEnvVariableDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'Key must only contain uppercase letters, numbers, and underscores',
  })
  key: string;

  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}
