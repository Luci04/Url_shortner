const express = require('express');
const shortid = require('shortid')
const createHttpError = require('http-errors')
const path = require('path');
const { default: mongoose } = require('mongoose');
const ShortUrl = require('./models/url.model');
const { url } = require('inspector');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT

const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Mongoose Connected'))
    .catch(error => console.log('Error in DB Connection'))

app.set('view engine', 'ejs');

app.get('/', async (req, res, next) => {
    res.render('index')
})

app.get('/:shortId', async (req, res, next) => {

    try {
        const { shortId } = req.params;
        const result = await ShortUrl.findOne({ shortId });
        if (!result) {
            throw createHttpError.NotFound('Short Url does not exist')
        }

        res.redirect(result.url);
    } catch (err) {
        next(err);
    }
})

app.post('/', async (req, res, next) => {
    try {
        const { url } = req.body
        if (!url) {
            throw createHttpError.BadRequest('Provide a Valid url')
        }

        const UrlExist = await ShortUrl.findOne({ url })

        if (UrlExist) {
            res.render('index', { url: url, short_url: `/${UrlExist.shortId}` })
            return
        }

        const shortUrl = new ShortUrl({ url: url, shortId: shortid.generate() })
        const result = await shortUrl.save();

        res.render('index', { url: url, short_url: `http://localhost:5000/${result.shortId}` })
    } catch (error) {
        next(error)
    }
})


app.use((req, res, next) => {
    next(createHttpError.NotFound());
})


app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('index', { error: err.message })
})

app.listen(PORT, () => console.log('Server running on port', PORT));