import listNoteService from '../services/listNoteService.js';

export default {
    async create(req, res) {
        const { name = '', content = '', listId = null } = req.body;
        const newNote = await listNoteService.create({
            name,
            content,
            listId,
        });
        res.status(201).json(newNote);
    },

    async getAllForList(req, res) {
        const id = parseInt(req.params.list_id);
        const notes = await listNoteService.getAllForList(id);
        res.status(200).json(notes);
    },

    async getById(req, res) {
        const id = parseInt(req.params.note_id);
        const note = await listNoteService.getById(id);
        res.status(200).json(note);
    },

    async update(req, res) {
        const id = parseInt(req.params.note_id);
        const { name = undefined, content = undefined } = req.body;
        const updatedNote = await listNoteService.update(id, {
            name,
            content,
        });
        res.status(200).json(updatedNote);
    },

    async delete(req, res) {
        const id = parseInt(req.params.note_id);
        await listNoteService.remove(id);
        res.status(204).send();
    },
};
