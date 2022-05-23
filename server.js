const express = require('express')
const app = express()
const https = require('https')
const cors = require('cors')
const path = require('path')
app.use(cors())
app.set('view engine', 'ejs')
const bodyparser = require("body-parser")
const mongoose = require('mongoose')
var session = require('express-session')

app.use(session({
    secret: 'ljkdghfoh',
    saveUninitialized: true,
    resave: true
}))

app.use(bodyparser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb+srv://andyhplau:comp1537@cluster-comp1537-assign.679wm.mongodb.net/2537-assignments?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const timeeventSchema = new mongoose.Schema({
    text: String,
    time: String,
    hits: Number
});

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: String,
    email: String,
    password: String
})

const timeeventModel = mongoose.model("timeevents", timeeventSchema);
const userModel = mongoose.model("users", userSchema)

app.listen(process.env.PORT || 5002, (err) => {
    if (err)
        console.log(err)
})

app.use(express.static('./public'))

app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/signup.html'))
})

app.put('/signup/create', function (req, res) {
    userModel.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }, function (err, data) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log('Data' + data)
        }
        res.send("New user created!")
    })
})

app.post('/login/authentication', function (req, res) {
    userModel.find({}, function (err, users) {
        if (err) {
            console.log('Error' + err)
        } else {
            console.log('Data' + users)
        }

        user = users.filter((userObj) => {
            return userObj.username == req.body.username
        })

        if (user[0].password == req.body.password) {
            req.session.authenticated = true
            req.session.userObj = {
                userId: user[0]._id,
                username: user[0].username,
                firstname: user[0].firstname,
                lastname: user[0].lastname,
                email: user[0].email
            }
            res.send('success')
        } else {
            req.session.authenticated = false
            res.send('fail')
        }
    })
})

app.get('/userObj', function (req, res) {
    res.send(req.session.userObj)
})

app.get('/login', function (req, res) {
    console.log(req.session.authenticated)
    if (req.session.authenticated) {
        res.redirect('/profile')
    } else {
        res.sendFile(path.join(__dirname + '/public/login.html'))
    }
})

app.get('/profile', function (req, res) {
    if (req.session.authenticated) {
        res.sendFile(path.join(__dirname + '/public/profile.html'))
    } else {
        res.redirect('/login')
    }
})

app.get('/search', function (req, res) {
    if (req.session.authenticated) {
        res.sendFile(path.join(__dirname + '/public/search.html'))
    } else {
        res.redirect('/login')
    }
})

app.put('/timeline/insert', function (req, res) {
    console.log(req.body)
    timeeventModel.create({
        text: req.body.text,
        time: req.body.time,
        hits: req.body.hits
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Insertion successful!");
    });
});

app.get('/timeline/read', function (req, res) {
    timeeventModel.find({}, function (err, data) {
        if (err) {
            console.log("Error" + err)
        } else {
            console.log("Data" + data)
        }
        res.send(data)
    })
})

app.get('/timeline/incrementHits/:id', function (req, res) {
    timeeventModel.updateOne({
        _id: req.params.id,
    }, {
        $inc: {
            hits: 1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err)
        } else {
            console.log("Data " + data)
        }
        res.send("Update successful!")
    })
})

app.get('/timeline/delete/:id', function (req, res) {
    timeeventModel.remove({
        _id: req.params.id,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Delete successful!");
    });
});

app.get('/pokemon/:id', function (req, res) {
    const url = `https://warm-lowlands-28229.herokuapp.com/api/pokemon/id/${req.params.id}`
    data = '';

    https.get(url, (https_res) => {
        https_res.on('data', (chunk) => {
            data += chunk
        })

        https_res.on('end', () => {
            data = JSON.parse(data)

            pokemonAbilities = data.abilities.map((abilityObj) => {
                return abilityObj.ability.name
            })

            pokemonType = data.types.map((typeObj) => {
                return typeObj.type.name
            })

            pokemonHp = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'hp'
            }).map((hpObj) => {
                return hpObj.base_stat
            })

            pokemonAttack = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'attack'
            }).map((attackObj) => {
                return attackObj.base_stat
            })

            pokemonDefense = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'defense'
            }).map((defenseObj) => {
                return defenseObj.base_stat
            })

            pokemonSpeed = data.stats.filter((statsObj) => {
                return statsObj.stat.name == 'speed'
            }).map((speedObj) => {
                return speedObj.base_stat
            })

            res.render('pokemon.ejs', {
                'id': data.id,
                'name': data.name.toUpperCase(),
                'img_path': data.sprites.other["official-artwork"]["front_default"],
                'ability': pokemonAbilities,
                'type': pokemonType,
                'hp': pokemonHp,
                'attack': pokemonAttack,
                'defense': pokemonDefense,
                'speed': pokemonSpeed,
                'height': data.height,
                'weight': data.weight
            })
        })
    })
})