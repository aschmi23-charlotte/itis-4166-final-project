import bcrypt from 'bcrypt';
import { findAll, findById, update, remove } from "../repositories/userRepo.js";

export async function getAllUsers() {
    return findAll();
}

export async function getLoggedInUser(id) {
    const user = await findById(id);
    if (user) return user;
  else {
    const error = new Error(`User ${id} not found`);
    error.status = 404;
    throw error;
  }
}

export async function updateUser(id, updatedData) {
  let plain_pwd = updatedData.password;
  updatedData.password = await bcrypt.hash(plain_pwd, await bcrypt.genSalt());

  const updatedPost = await update(id, updatedData);
  if (updatedPost) return updatedPost;
  else {
    const error = new Error(`User ${id} not found`);
    error.status = 404;
    throw error;
  }
}

export async function deleteUser(id) {
  const result = await remove(id);
  if (result) return;
  else {
    const error = new Error(`User ${id} not found`);
    error.status = 404;
    throw error;
  }
}

