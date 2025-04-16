import { IsNotEmpty, IsString } from "class-validator";

export class CreateSessionDto {
    user_id: number;

    @IsNotEmpty({ message: "Session token is required" })
    @IsString({ message: "Session token value type shuold be String " })
    token: string;

    @IsNotEmpty({ message: "Session expired date is required"})
    expried_at: Date;

    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}