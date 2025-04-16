import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SigninUsertDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'auth.validation.signin.email_required' })
    @IsString()
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'auth.validation.signin.password_required' })
    @IsString()
    password: string;
}