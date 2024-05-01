import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
import { deleteBeeByName } from "dataManager";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json())

app.use('/pub', express.static(path.join(__dirname, 'static')));

app.listen(3000, () => {
    console.log('Welcome to the Beehive! Open this link: http://127.0.0.1:3000');
})

let actuallyId = 1
const beehive = [{ id: 1, name: "Buttercup" }];

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
})

app.get('/api/beehive', async (req, res, next) => {
    try {
        res.json(beehive)
    } catch (error) {
        next(error)
    }
})

app.post('/api/bees', async (req, res, next) => {
    try {
        if (!req.body.hasOwnProperty('name')) {
            return res.status(400).json({ error: "Request body must contain name key" });
        }

        const beeId = actuallyId + 1;
        actuallyId++;
        const beeName = req.body.name;
        const newBee = { id: beeId, name: beeName }
        beehive.push(newBee);
        console.log(beehive)
        res.status(201).json(`${beeName} flew into the hive!`);
    } catch (error) {
        next(error)
    }

})

app.patch('/api/bees/:id', async (req, res, next) => {
    try {
        if (!req.params) {
            return res.status(400).json({ error: "Request body must contain 'name' key" });
        }

        const beeId = req.params.id
        let beeName;
        for (const bee of beehive) {
            if (bee.id == beeId) {
                beeName = bee.name;
                bee.name = req.body.name;
            }
        }

        res.status(200).json(`${beeName} change its name to ${req.body.name}!`);
    } catch (error) {
        next(error);
    }

})

app.delete('/api/bees', async (req, res, next) => {
    try {
        const beeName = req.body.name;
        let deletedItem = null;

        deleteBeeByName(beeName, beehive);

        if (!deletedItem) {
            return res.status(204).end();
        }

        res.status(200).json(`${beeName} flew away from the hive!`);
    } catch (error) {
        next(error);
    }

})

