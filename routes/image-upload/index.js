'use strict';
const axios = require('axios');
const multer = require('multer');
const express = require('express');
const router = express.Router();

const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/../../static/uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    const error = new Error('Unsupported mimetype');
    error.status = 400;
    cb(error, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  },
  fileFilter
});

router.post('/', upload.single('image'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ message: 'No image' });
  try {
    const result = await axios({
      url: `${process.env.IMAGE_SERVICE}`,
      method: 'POST',
      data: {
        filename: req.file.filename
      },
      json: true
    })
    res.status(200).json(result.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;