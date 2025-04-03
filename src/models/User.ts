import prisma from "../config/database";
import { IUser } from "../interfaces/IUser";

class User {
  async findAll(): Promise<IUser[]> {
    return prisma.user.findMany();
  }

  async findById(id: number): Promise<IUser | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(user: IUser): Promise<IUser> {
    return prisma.user.create({ data: user });
  }

  async update(id: number, user: IUser): Promise<IUser> {
    return prisma.user.update({ where: { id }, data: user });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}

export default new User();
