// Import the Note and User model from your Sequelize setup
import {Note} from '../models/Note';
import {User} from '../models/User';

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.user;

    // Check if the user exists (assuming you have a User model)
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create the note
    const note = await Note.create({
      title,
      content,
      user: id, // Associate the note with the user
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message, details: error });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const { id } = req.user;

    // Check if the user exists (assuming you have a User model)
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all notes associated with the user
    const notes = await Note.findAll({
      where: { user: id },
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message, details: error });
  }
};

const getNoteById = async (req, res) => {
  try {
    console.log('getNoteById => req.user: ', req.user);
    const { id } = req.user;
    const { noteId } = req.params;

    // Check if the user exists (assuming you have a User model)
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the note associated with the user
    const note = await Note.findOne({
      where: { id: noteId, user: id },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message, details: error });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.user;
    const { noteId } = req.params;
    const { title, content } = req.body;

    // Check if the user exists (assuming you have a User model)
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the note associated with the user
    const note = await Note.findOne({
      where: { id: noteId, user: id },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Update the note
    note.title = title;
    note.content = content;
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message, details: error });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.user;
    const { noteId } = req.params;

    // Check if the user exists (assuming you have a User model)
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the note associated with the user
    const note = await Note.findOne({
      where: { id: noteId, user: id },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Delete the note
    await note.destroy();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, details: error });
  }
};

export {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote
}