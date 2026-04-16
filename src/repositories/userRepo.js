import prisma from '../config/db.js'

export async function create(data) {
    try {
        const newUser = await prisma.user.create({data, omit: {password: true}});
        return newUser;
    } catch (error) {
        if (error.code === 'P2002') {
            const err = new Error('Email has already been used');
            err.status = 409;
            throw err;
        } else {
            throw error;
        }
    }

}

export async function findByEmailInternal(email) {
    return prisma.user.findUnique({where: {email: email}});
}

export async function findAll() {
    return prisma.user.findMany({omit: {password: true}});
}

export async function findById(id) {
    return prisma.user.findUnique({where: {id: id}, omit: {password: true}});
}

export async function update(id, updatedData) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedData,
      omit: {password: true}
    });
    return updatedUser;
  } catch (error) {
    if (error.code === 'P2025') return null;
    if (error.code === 'P2002') {
        const err = new Error('Email has already been used');
        err.status = 409;
        throw err;
    }
    throw error;
  }
}

export async function remove(id) {
  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
      omit: {password: true}
    });
    return deletedUser;
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
}
