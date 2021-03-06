const express = require('express');
const cors = require('cors');


const db = require('../data/dbConfig');

const server = express();

server.use(express.json());
server.use(cors());

// sanity check endpoint
server.get('/', (req, res) => {
    res.status(200).json({ api: 'up and running' });
});

//GET a list of notes
server.get('/api/notes', (req, res) => {
    db('notes')
      .then(notes => res.status(200).json(notes))
      .catch(err => res.status(500).json(err));
});

//GET note by id 
server.get('/api/notes/:noteId', (req, res) => {
    const { noteId } = req.params;
    
    db('notes')
      .where({ id: noteId})
      .first()
      .then(note => {
        if (!note) {
            res.status(404).json({ message: 'A note with that ID was not found.' });
        } else {
            res.status(200).json(note);
        }
    })
    .catch(err => {
        res.status(500).json({ error: 'There was an error getting the note.', err });
    });
});

//POST a note with title & content
server.post('/api/notes/create', (req, res) => {
    const note = req.body;
  
    db('notes')
      .insert(note)
      .then(ids => {
        res.status(201).json({message: "added note with the id of", ids});
      })
      .catch(err => {
        res.status(500).json({ message: 'Error inserting', err });
      });
  });
  
  //PUT: edit a note based on :noteId
  server.put('/api/notes/editNote/:id', (req, res) => {
      const changes = req.body;
      const { id } = req.params;

      if (!changes.title || !changes.content) {
        res.status(500).json({ message: 'Please provide a title and content.' });
      } else {
        db('notes')
        .where({ id: id })
        .update(changes)
        .then(count => {
            if (count === 0) {
                res.status(404).json({ message: 'A note with that ID does not exist.' });
            } else {
                res.status(201).json({message: 'updated the following amount of notes:',count});
            }
        })
        .catch(err => {
            res.status(500).json({ error: 'There was an error editing the note.', err });
        });
    }
    });

    server.delete('/api/notes/delete/:noteId', (req, res) => {
        const { noteId } = req.params;
        db('notes')
            .where({ id: noteId })
            .del()
            .then(count => {
                if (count === 0) {
                    res.status(404).json({ message: 'A note with that ID does not exist.' });
                } else {
                    res.status(200).json({message: 'deleted the following amount of notes:',count});
                }
            })
            .catch(err => {
                res.status(500).json({ error: 'There was an error deleting the note.', err });
            });
    });
  
  


module.exports = server;