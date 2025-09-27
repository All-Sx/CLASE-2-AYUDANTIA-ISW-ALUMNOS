import {
  findUserById,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../Handlers/responseHandlers.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export async function getPrivateProfile(req, res) {
  try {
    const userId = req.userId; 
    const user = await findUserById(userId);

    if (!user) {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }

    handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
      message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
      userData: user,
    });
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener perfil privado", error.message);
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = parseInt(req.userId, 10);

    if (isNaN(userId)) {
    return handleErrorClient(res, 400, "ID de usuario inválido en el token");
    }
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return handleErrorClient(res, 400, "Datos para actualizar requeridos");
    }

    const updatedUser = await updateUser(userId, data);
    handleSuccess(res, 200, "Usuario actualizado exitosamente", updatedUser);
  } catch (error) {
    if (error.status) {
      return handleErrorClient(res, error.status, error.message);
    }
    handleErrorServer(res, 500, "Error al actualizar usuario", error.message);
  }
}

export async function deleteProfile(req, res) {
  try {
    const userId = req.userId;
    await deleteUser(userId);
    handleSuccess(res, 200, "Usuario eliminado exitosamente", { id: userId });
  } catch (error) {
    if (error.status) {
      return handleErrorClient(res, error.status, error.message);
    }
    handleErrorServer(res, 500, "Error al eliminar usuario", error.message);
  }
}