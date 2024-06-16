const express = require('express');
const cors = require('cors');
const Datastore = require('nedb');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize NeDB
const db = new Datastore({ filename: 'pets.db', autoload: true });

// Create a new pet
app.post('/api/pets', (req, res) => {
  const pet = { ...req.body };
  db.insert(pet, (err, newPet) => {
    if (err) {
      res.status(500).json({ message: 'Failed to add pet' });
    } else {
      res.status(201).json(newPet);
    }
  });
});

// Read all pets
app.get('/api/pets', (req, res) => {
  db.find({}, (err, pets) => {
    if (err) {
      res.status(500).json({ message: 'Failed to fetch pets' });
    } else {
      res.json(pets);
    }
  });
});

// Read a single pet by ID
app.get('/api/pets/:id', (req, res) => {
  db.findOne({ _id: req.params.id }, (err, pet) => {
    if (err) {
      res.status(500).json({ message: 'Failed to fetch pet' });
    } else if (pet) {
      res.json(pet);
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  });
});

// Update a pet by ID
app.put('/api/pets/:id', (req, res) => {
  const update = { ...req.body };
  db.update({ _id: req.params.id }, { $set: update }, {}, (err, numReplaced) => {
    if (err) {
      res.status(500).json({ message: 'Failed to update pet' });
    } else if (numReplaced) {
      res.json({ message: 'Pet updated' });
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  });
});

// Delete a pet by ID
app.delete('/api/pets/:id', (req, res) => {
  db.remove({ _id: req.params.id }, {}, (err, numRemoved) => {
    if (err) {
      res.status(500).json({ message: 'Failed to delete pet' });
    } else if (numRemoved) {
      res.json({ message: 'Pet deleted' });
    } else {
      res.status(404).json({ message: 'Pet not found' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
