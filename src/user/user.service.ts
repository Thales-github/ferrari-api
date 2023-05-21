/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }


    async get(id: number, hash = false) {

        id = Number(id);

        if (isNaN(id)) throw new BadRequestException("O id é inválido");

        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                person: true
            }
        });

        if (!user) throw new NotFoundException("Usuário não encontrado");

        if (!hash) {

            delete user.password;
        }
        return user;
    }

    async getByEmail(email: string) {

        if (!email) throw new BadRequestException("O email é inválido");

        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                person: true
            }
        });

        if (!user) throw new NotFoundException("Usuário não encontrado");

        delete user.password;
        return user;
    }

    async create({
        name, email, birthAt, phone, document, password
    }: {
        name: string; email: string; birthAt?: Date; phone?: string; document?: string; password: string
    }) {

        if (!name) throw new BadRequestException("Nome é inválido");
        if (!email) throw new BadRequestException("Email é inválido");
        if (!password) throw new BadRequestException("Senha é inválido");
        if (birthAt && birthAt.toString().toLowerCase() === "invalid date") {
            throw new BadRequestException("A data é inválida");
        }
        let user = null;
        try {
            user = await this.getByEmail(email);

        } catch (error) {

        }
        if (user) throw new BadRequestException("Email já existe");

        const userCreated = await this.prisma.user.create({
            data: {
                person: {
                    create: {
                        name,
                        birthAt,
                        document,
                        phone,
                    }
                },
                email,
                password: bcrypt.hashSync(password, 10),
            },
            include: {
                person: true,
            }
        });

        delete userCreated.password;

        return userCreated;
    }

    async update(id: number, {
        name, email, birthAt, phone, document
    }: {
        name: string; email: string; birthAt?: Date; phone?: string; document?: string
    }) {

        id = Number(id);

        if (isNaN(id)) {
            throw new BadRequestException("Id é Inválido");
        }
        const dataPerson = {} as Prisma.PersonUpdateInput;
        const dataUser = {} as Prisma.UserUpdateInput;

        if (name) {
            dataPerson.name = name;
        }
        if (birthAt) {
            dataPerson.birthAt = birthAt;
        }
        if (phone) {
            dataPerson.phone = phone;
        }
        if (document) {
            dataPerson.document = document;
        }
        if (email) {
            dataUser.email = email;
        }

        const user = await this.get(id);
        if (dataPerson) {
            await this.prisma.person.update({
                where: {
                    id: user.personId
                },
                data: dataPerson

            });
        }
        if (dataUser) {
            await this.prisma.user.update({
                where: {
                    id,
                },
                data: dataUser
            });
        }

        return this.get(id);
    }

    async checkPassword(id: number, password: string) {

        const user = await this.get(id, true);

        // console.log(password, user.password);


        const checked = await bcrypt.compare(password, user.password);

        if (!checked) {
            throw new UnauthorizedException("email ou senha incorretos");
        }

        return true;
    }
}