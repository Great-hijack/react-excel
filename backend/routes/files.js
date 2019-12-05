const express = require('express');
const fileRoutes = express.Router();
let File = require('../models/File');
const multer = require("multer");
const fs = require('fs-extra');
const storageBase = require("../config/keys").storageBase;

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { file_type, file_owner } = req.body;
        const date = new Date();
        const path = `${storageBase}` + `${file_type}/${date.getFullYear()}` + `-${date.getMonth() + 1}/${date.getMonth() + 1}` + `-${date.getDate()}/${file_owner}`;
        if (!fs.existsSync(path)) {
            fs.mkdirsSync(path)
        }
        cb(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage });


fileRoutes.route('/').get(function (req, res) {
    var user = JSON.parse(req.query.user);
    var config = JSON.parse(req.query.config);
    var query = {};

    query = { owner: user.name };

    File.find(query)
        .sort({ register_date: -1 })
        .then(files => {
            var retFiles;
            var totalItems = files.length;
            var currentPageNumber = Math.min(config.currentPageNumber, Math.ceil(totalItems / config.itemsPerPage));
            if (!config.all)
                retFiles = files.slice((currentPageNumber - 1) * config.itemsPerPage, Math.min(currentPageNumber * config.itemsPerPage, totalItems));
            else
                retFiles = files;
            res.json({
                files: retFiles,
                currentPageNumber: currentPageNumber,
                totalItems: totalItems,
                itemsPerPage: config.itemsPerPage
            });
        });
});

fileRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    File.findById(id, function (err, file) {
        res.json(file);
    });
});

fileRoutes.route('/update/:id').post(function (req, res) {
    File.findById(req.params.id, function (err, file) {
        if (!file)
            res.status(404).send("file is not found");
        else {
            // file.type = req.body.type;
            // file.url = req.body.url;
            // file.description1 = req.body.description1;
            // file.description2 = req.body.description2;
            // file.description3 = req.body.description3;
            // file.owner = req.body.owner;
            // file.owner_job = req.body.owner_job;

            // file.save().then(file => {
            //     res.json('file updated!');
            // }).catch(err => {
            //     res.status(400).send("Update not possible");
            // });
            res.json('not implemented');
        }
    });
});

fileRoutes.route('/download/:id').get(function (req, res) {
    let file_id = req.params.id;
    File.findById(file_id, function (err, file) {
        const data = fs.readFileSync(file.file_url)
        if (err) res.status(400).send("download failed");;
        res.status(200).send(data);
    });

});

fileRoutes.route('/upload').post(upload.single('file_data'), function (req, res) {
    const { file_type, file_description, file_owner } = req.body;

    let file = new File({
        type: file_type,
        saved_url: req.file.path,
        description: file_description,
        owner: file_owner,
    });


    file.save()
        .then(file => {
            res.status(200).json({ 'file': 'file uploaded successfully' });
        })
        .catch(err => {
            res.status(400).send('upload failed');
        });
});

module.exports = fileRoutes;
