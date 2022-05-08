const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('./model/user');
const passwordHash = require('password-hash');
const cors = require('cors');

const JWT_SECRET = 'a12io31m23n123knjj!@#!#@Nn';

mongoose.connect('mongodb://localhost:27017/login-app-db',
{
    useNewUrlParser: true,
      useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'static')));


app.post('/change-password', async (req,res) => {
    const { token, newPassword: plainTextPassword } = req.body;
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
    const password = await bcrypt.hash(plainTextPassword, 10);

    await User.updateOne({ _id }, {
        $set: { password }
    })


    res.json({ status: 'ok'})
});

app.post('/login', async (req,res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();

    if(!user) {
        return res.json({ status: 'error', error: 'Invalid name/password'});
    }

    if (await bcrypt.compare(password, user.password)) {

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            JWT_SECRET
        )
        
        return res.json({ status: 'ok', data: token });
    }

    res.json({ status: 'error', error: 'Invalid name/password'});
});



app.post('/register', async (req,res) => {
    const { firstName, lastName, username, password: plainTextPassword } = req.body;
    const password = await bcrypt.hash(plainTextPassword, 10);

    await User.create({
        firstName,
        lastName,
        username,
        password
    });
})

app.listen(3000, () => {
})