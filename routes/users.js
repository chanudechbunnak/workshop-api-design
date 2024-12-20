var express = require('express');
var router = express.Router();
var userSchema = require('../models/user.model');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const tokenMiddleware = require('../middleware/token.middleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + "_" + file.originalname)
  }
})

const upload = multer({ storage: storage })

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let user = await userSchema.find({});
  res.send(user);
});

router.get('/:id', async function(req, res, next) {
  try {
    let { id } = req.params;
    let user = await userSchema.findById(id);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error fetching user by ID" });
  }
});

router.post('/', upload.single("image"), async function(req, res, next) {
  let { user_id, username, password, name, lastname, age, sex } = req.body;
  let user = new userSchema({
    user_id: user_id,
    username: username,
    password: await bcrypt.hash(password, 10),
    name: name, 
    lastname: lastname,
    age: age, 
    sex: sex,
    
  });

  // let token = await jwt.sign({foo: "bar"}, "2001")
  await user.save()
  res.send(user);
});

router.put('/:id', async function(req, res, next) {
  try{ 
    let { id } = req.params
    let { user_id, username, password, name, lastname, age, sex} = req.body
    
    let user = await userSchema.findByIdAndUpdate(id, { name,age,user_id,username,password,lastname,sex }, { new: true })

    res.send(user)

  } catch(error){
    res.send(error)
  }
});

router.delete('/:id', async function(req, res, next) {
  try{ 
    let { id } = req.params 
    let user = await userSchema.findByIdAndDelete(id)

    res.send(user)

  } catch(error){
    res.send(error)
  }
});

module.exports = router;
