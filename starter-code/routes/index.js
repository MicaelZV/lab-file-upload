const express = require('express');
const router  = express.Router();
const Picture = require('../models/Picture');
const User = require('../models/User');

const multer  = require('multer');
const upload = multer({ dest: './public/uploads/' }); 

router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/posts', (req, res, next) => {
  Post.find()
  .then(allPosts => {
    res.render("posts", { allPosts });
  })
  .catch(error => {
    console.log(error);
  });
});

router.post('/upload', upload.single('photo'),(req, res) => {
  const pic = new Picture({
    name: req.body.name,
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
    user_id: 6754375436
  });

  pic.save((err) => {
      res.redirect('/');
  });
});
module.exports = router;