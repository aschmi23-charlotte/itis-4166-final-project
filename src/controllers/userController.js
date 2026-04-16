import {
    getAllUsers,
    getLoggedInUser,
    updateUser,
    patchUser,
    deleteUser,
} from '../services/userService.js';


export async function getAllUsersHandler(req, res) {
    const users = await getAllUsers();
    res.status(200).json(users);
}

export async function getLoggedInUserHandler(req, res) {
    const id = parseInt(req.param_user_id);
    const post = await getLoggedInUser(id);
    res.status(200).json(post);
}

export async function updateLoggedInUserHandler(req, res) {
    const id = parseInt(req.param_user_id);
    const { email, password } = req.body;
    const updatedUser = await updateUser(id, { email, password });
    res.status(200).json(updatedUser);
}

export async function patchLoggedInUserHandler(req, res) {
    const id = parseInt(req.param_user_id);
    const { role } = req.body;
    const patchedUser = await patchUser(id, { role });
    res.status(200).json(patchedUser);
}

export async function deleteLoggedInUserHandler(req, res) {
    const id = parseInt(req.param_user_id);
    await deleteUser(id);
    res.status(204).send();
}


// export async function getPostsForLoggedInUserHandler(req, res) {
//   const id = parseInt(req.user.id);
//   // Will throw an error if the user doesn't exist.
//   const user = await getLoggedInUser(id);
//   console.log(user);
//   const posts = await getAllForUser(id);
//   console.log(posts);

//   res.status(200).send(posts);
// }
