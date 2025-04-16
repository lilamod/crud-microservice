import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: "Name is required" })
    @IsNotEmpty({ message: "Name is required" })
    @IsString({ message: "Name should be string value" })
    name: string;

    @ApiProperty({ description: "Email is required" })
    @IsNotEmpty({ message: "Email is required " })
    @IsString({ message: "Email should be string value" })
    email: string;

    @ApiProperty({ description: "Password is required" })
    @IsNotEmpty({ message: "PassWord is required" })
    @IsString({ message: "Password should be string value" })
    password: string;

    @ApiProperty({ description: "Phone is required" })
    @IsNotEmpty({ message: "Phone is required" })
    @IsString({ message: "Phone should be string value" })
    phone: string;

    salt: string;

    is_deleted: boolean;
    created_at: Date;
    update_at: Date;

}