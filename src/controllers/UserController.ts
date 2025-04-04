import { Request, Response } from "express";
import User from "../models/User";
import { IUser } from "../interfaces/IUser";

class UserController {
  async getAll(req: Request, res: Response): Promise<Response | void> {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }

  async getOne(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const user = await User.findById(Number(id));
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar usuário" });
    }
  }

  async create(req: Request, res: Response): Promise<Response | void> {
    try {
      const newUser: IUser = req.body;
      const user = await User.create(newUser);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao criar usuário" });
    }
  }

  async update(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const userUpdate: IUser = req.body;
      const updatedUser = await User.update(Number(id), userUpdate);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      await User.delete(Number(id));
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  }
}

// Exportando uma instância da classe, e não a classe em si
export default new UserController();
