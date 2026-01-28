const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');
const csv = require('csv-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// middleware per gestre le richieste json
app.use(express.json());

// funzione per leggere un file csv
function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const products = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => products.push(row))
            .on('end', () => resolve(products))
            .on('error', reject);
    });
}

// funzione per leggere un file xml
function readXML(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) reject(err);
            xml2js.parseString(data, (err, result) => {
                if (err) reject(err);
                resolve(result.products.product);
            });
        });
    });
}

// funzione per leggere un file json
function readJSON(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        });
    });
}

// api per ottenere prodotti da csv
app.get('/api/prodotti/csv', async (req, res) => {
    try {
        const products = await readCSV(path.join(__dirname, 'prodotti.csv'));
        res.json(products);
    } catch (error) {
        res.status(500).send('Errore nel recupero dei dati CSV');
    }
});

// api per ottenere prodotti da xml
app.get('/api/prodotti/xml', async (req, res) => {
    try {
        const products = await readXML(path.join(__dirname, 'prodotti.xml'));
        res.json(products);
    } catch (error) {
        res.status(500).send('Errore nel recupero dei dati XML');
    }
});

// api per ottenere prodotti da json
app.get('/api/prodotti/json', async (req, res) => {
    try {
        const products = await readJSON(path.join(__dirname, 'prodotti.json'));
        res.json(products);
    } catch (error) {
        res.status(500).send('Errore nel recupero dei dati JSON');
    }
});

// avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});
