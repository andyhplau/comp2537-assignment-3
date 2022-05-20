const express = require('express')
const app = express()
const https = require('https')
const cors = require('cors')
app.use(cors())
app.set('view engine', 'ejs')
const bodyparser = require("body-parser")
const mongoose = require('mongoose')

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

const timeeventModel = mongoose.model("timeevents", timeeventSchema);

app.listen(process.env.PORT || 5000, (err) => {
    if (err)
        console.log(err)
})

app.use(express.static('./public'))

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