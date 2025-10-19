import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  const saved = await userRepository.save(newUser);

  //no entregar contrasena al crear
  const { password, ...userWithoutPassword } = saved;
  return userWithoutPassword;
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

export async function findUserById(id) {
  return await userRepository.findOneBy({ id });
}

//modificar usuario
export async function updateUser(id, data) {
  const userId = Number(id);
  const { email, password } = data || {};

  if (!email && !password) {
    throw { status: 400, message: "Nada por actualizar" };
  }

  //borrar usuario id actual
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  //validar formato email
  if (email) {
    if (!emailRegex.test(email)) {
      throw { status: 400, message: "Formato de email inválido" };
    }
    const existing = await userRepository.findOneBy({ email });
    if (existing && String(existing.id) !== String(userId)) {
      throw { status: 409, message: "El email ya está en uso" };
    }
    user.email = email;
  }

  //cambio de password
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
  }

  const updated = await userRepository.save(user);
  const { password: _, ...result } = updated;
  return result;
}

//eliminar usuario
export async function deleteUser(id) {
  const userId = Number(id);

  const user = await userRepository.findOneBy({ id: userId });
  if (!user) {
    throw { status: 404, message: "Usuario no encontrado" };
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.manager.delete(User, { id: userId });

    await queryRunner.commitTransaction();
    return true;
  } catch (err) {
    console.error("----- ERROR REAL DE LA BASE DE DATOS -----", err);
    await queryRunner.rollbackTransaction();
    if (err.status && err.message) throw err;
    throw { status: 500, message: "Error al eliminar usuario" };
  } finally {
    await queryRunner.release();
  }
}