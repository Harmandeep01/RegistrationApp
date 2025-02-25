const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const hbs = require('hbs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const Register = require('./models/registerationSchema');

const DB = require('./db/conn');
DB();


app.use(express.json());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));;

const partialsPath = path.join(__dirname, '../templates/partials');
hbs.registerPartials(partialsPath);

const viewsPath =  path.join(__dirname, '../templates/views');
app.set('views', viewsPath);
app.set('view engine', 'hbs');


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signup', (req, res) => {    
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/registration', async (req, res) => {
    try {
        const pass = req.body.password;
        const cpass = req.body.confirmpassword;
        
        if (pass !== cpass) {
            return res.status(400).json({ error: "Passwords do not match" });
        } 
        
        const registerUser = new Register({
            username: req.body.username,
            email: req.body.email,
            password: pass,
            confirmpassword: cpass
        });

        const token = await registerUser.generateAuthToken();

        await registerUser.save();
        res.status(201).render('index');
      
    
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Destructure email and password from req.body

        const userEmail = await Register.findOne({ email: email });

        if (!userEmail) {
            return res.status(400).send("Invalid Login Details");
        }

        const isMatch = await bcrypt.compare(password, userEmail.password);
        const token = await userEmail.generateAuthToken();
        console.log(`The token is ${token}`);
        if (!isMatch) {
            return res.status(400).send("Invalid Login Details");
        }
           
        res.status(200).render('index');   

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Internal Server Error");
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});