const express = require('express');
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
        console.log(req.body);
        const registerUser = new Register({
            username: req.body.username,
            email: req.body.email,
            password: pass
        });

        await registerUser.save();
        console.log(registerUser);
        res.status(201).render('index');
      
    
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Destructure email and password from req.body

        // Find the user by email
        const userEmail = await Register.findOne({ email: email });

        // Check if the user exists
        if (!userEmail) {
            return res.status(400).send("Invalid Login Details: User not found");
        }

        // Compare the provided password with the stored password
        if (userEmail.password === password) {
            res.status(201).render('index'); // Render the index page on successful login
            console.log("Login Successful");
        } else {
            res.status(400).send("Invalid Login Details: User not found");
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});