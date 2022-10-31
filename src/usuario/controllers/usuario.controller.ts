import { Body, Controller, Get, HttpCode, Post, Put, UseGuards } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger/dist";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { Usuario } from "../entities/usuario.entity";
import { UsuarioService } from "../services/usuario.service";

@ApiTags('Usuarios')
@Controller('/usuarios')
export class UsuarioController{
    constructor(private readonly usuarioService: UsuarioService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    findAll (): Promise<Usuario[]>{
        return this.usuarioService.findAll()
    }

    @Post('/cadastrar')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() usuario: Usuario): Promise<Usuario>{
        return await this.usuarioService.create(usuario)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('/atualizar')
    @HttpCode(HttpStatus.OK)
    async update(@Body() usuario: Usuario): Promise<Usuario>{
        return await this.usuarioService.update(usuario)
    }
}