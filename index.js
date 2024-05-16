import express from "express";
import path from 'path';
import { fileURLToPath } from "url";
import { searchBee } from './utils.js';
import { deleteBee } from "./utils.js";
import { findOneBee } from "./utils.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json())

app.use('/pub', express.static(path.join(__dirname, 'static')));

app.listen(3000, () => {
    console.log('Welcome to the Beehive! Open this link: http://127.0.0.1:3000');
})

let actuallyId = 1
const beehive = {bees: [
    { id: 1, name: "Buttercup" }]};

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

app.get('/api/bees/:id', async (req, res, next) => {
    let searchedBee;
    let beeId = req.params.id;
    try {
        searchedBee = findOneBee(beehive.bees, beeId)
        if (searchedBee === undefined) {
            res.status(404).json({message: `Bee with this id: ${beeId} not found.`})
        }
        res.status(200).json(searchedBee);
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
        beehive.bees.push(newBee);

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
        const reqBeeName = req.body.name;
        let beeName;
        beeName = searchBee(beehive.bees, beeId, reqBeeName)

        res.status(200).json(`${beeName} change its name to ${req.body.name}!`);
    } catch (error) {
        next(error);
    }

})

app.delete('/api/bees', async (req, res, next) => {
    try {
        const beeName = req.body.name;
        let deletedItem = null;

        deletedItem = deleteBee(beehive.bees, beeName)

        if (!deletedItem) {
            return res.status(404).end();
        }

        return res.status(204).end();
    } catch (error) {
        next(error);
    }
});


