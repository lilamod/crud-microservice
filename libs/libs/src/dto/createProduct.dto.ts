import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    user_id: number;

    @ApiProperty({ description: "Product name is required", required: true })
    @IsNotEmpty({ message: "Product name is required" })
    @IsString({ message: "Product name should be string" })
    name: string;

    @ApiProperty({ description : "Product description is optional"})
    @IsOptional()
    @IsString({ message: "Description should be string" })
    description: string;

    @ApiProperty({ description: "Product price required"})
    @IsNotEmpty({ message: "Product Price is required" })
    @IsString({ message: "Product Price should be string type" })
    price: string;

    @ApiProperty({ description: "Product stock is required"})
    @IsNotEmpty({ message: "Product Stock is required" })
    @IsNumber()
    stock: number;

    is_deleted: boolean;
    created_by: number;
    updated_by: number;
}