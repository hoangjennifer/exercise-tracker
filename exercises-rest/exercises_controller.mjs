import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
*
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function isDateValid(date) {
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

/**
 * Create a new exercise with the name, reps, weight, unit and date provided in the body
 */
app.post('/exercises', (req, res) => {
    const { name, reps, weight, unit, date } = req.body;
    const repsValue = parseInt(reps, 10);
    const weightValue = parseInt(weight, 10);

    if (!name || !reps || !weight || !unit || !date) {
        return res.status(400).json({ Error: 'Invalid request' })
    }
    if (name.trim() === '' || name.length === 0) {
        return res.status(400).json({ Error: 'Invalid request' })
    }

    if (repsValue !== +repsValue || repsValue <= 0) {
        return res.status(400).json({ Error: 'Invalid request' })
    }

    if (weightValue !== +weightValue || weightValue <= 0) {
        return res.status(400).json({ Error: 'Invalid request' })
    }

    if (unit.trim() !== 'kgs' && unit.trim() !== 'lbs') {
        return res.status(400).json({ Error: 'Invalid request' })
    }

    if (!isDateValid(date)) {
        return res.status(400).json({ Error: 'Invalid request' })

    }
    exercises.createExercise(name, reps, weight, unit, date)
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            // In case of an error, send back status code 400 in case of an error.
            // A better approach will be to examine the error and send an
            // error status code corresponding to the error.
            res.status(400).json({ Error: 'Request failed' });
        });
});


/**
 * Retrive the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Retrieve exercises. 
 * If the query parameters include reps, then only the exercises for those reps are returned.
 * Otherwise, all exercises are returned.
 */
app.get('/exercises', (req, res) => {
    let filter = {};
    // Is there a query parameter named reps?  If so add a filter based on its value.
    if (req.query.reps !== undefined) {
        filter = { reps: req.query.reps };
    }
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.json(exercises);
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        })
});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * its name, reps, weight, unit and date to the values provided in the body.
 */
app.put('/exercises/:_id', (req, res) => {
    const { name, reps, weight, unit, date } = req.body;
    const repsValue = parseInt(reps, 10);
    const weightValue = parseInt(weight, 10);

    if (!name || !reps || !weight || !unit || !date) {
        return res.status(400).json({ Error: 'Invalid request' })
    }
    if (name.trim() === '' || name.length === 0) {
        return res.status(400).json({ Error: 'Invalid request' })
    }

    if (repsValue !== +repsValue || repsValue <= 0) {
        return res.status(400).json({ Error: 'Invalid request' })
    }

    if (weightValue !== +weightValue || weightValue <= 0) {
        return res.status(400).json({ Error: 'Invalid request' })
    }

    if (unit.trim() !== 'kgs' && unit.trim() !== 'lbs') {
        return res.status(400).json({ Error: 'Invalid request' })
    }

    if (!isDateValid(date)) {
        return res.status(400).json({ Error: 'Invalid request' })

    }
    exercises.replaceExercise(req.params._id, name, reps, weight, unit, date)
        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ _id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date })
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        });
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});