const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const User = require('./model/user');
const Image = require('./model/image');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const request = require('request');

const JWT_SECRET = 'a12io31m23n123knjj!@#!#@Nn';

mongoose.connect('mongodb://localhost:27017/login-app-db',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
        res.cookie('jwt', token);
        return res.json({ status: 'ok', data: token });
    }

    res.json({ status: 'error', error: 'Invalid name/password'});
});

app.get('/logout', async (req,res) => {
    mongoose.connection.db.dropCollection('images', function(err, result) {});
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
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
});

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

app.post('/delete', async (req, res) => {
    const { email:username } = req.body;
    await User.deleteOne({username});
}); 

app.post('/download', async (req, res) => {
    const { jwtToken, photosUrl } = req.body;
    const usersEmail = jwt.verify(jwtToken, JWT_SECRET).username;
    const download = (url, path, callback) => {
        request.head(url, (err, res, body) => {
            request(url)
            .pipe(fs.createWriteStream(path))
            .on('close', callback)
        });
    };
    
    for (let i = 0; i < photosUrl.length; i++) {
        await Image.create({imageSource: photosUrl[i], emailOfUser: usersEmail});
        download(photosUrl[i], `./images/image-${i + 1}.png`, function(){
            console.log('done');
        });
    };
});

app.get('/visualize', async (req, res) => {
    const allImages = await Image.find();
    return res.json({ status: 'ok', data: allImages });
});

app.listen(3000, () => {})