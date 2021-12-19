const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const res = require('express/lib/response');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        Movies.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies});
            })
    },
    'detail': (req, res) => {
        Movies.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        Movies.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        Movies.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        Genres.findAll({
            include: [{association: 'peliculas'}]
        })
            .then(allGenres => res.render('moviesAdd', {allGenres}));
    },
    create: function (req,res) {
        const movieAdded = {
            title: req.body.title,
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length,
            genre_id: req.body.genre_id
        }
        Movies.create(movieAdded)
            .then(() => res.redirect('/movies'));
    },
    edit: function(req,res) {
        const movieToEdit = Movies.findByPk(req.params.id);
        const allGenres = Genres.findAll();
            
        Promise.all([movieToEdit, allGenres])
            .then(([Movie, allGenres]) => res.render("moviesEdit", { Movie, allGenres }));
    },
    update: function (req,res) {
        Movies.update({
            title: req.body.title,
            rating: req.body.rating,
            awards: req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length,
            genre_id: req.body.genre_id
        },
        {
            where: {id: req.params.id}
        }).then(() => res.redirect('/movies'));
    },
    delete: function (req,res) {
        Movies.findByPk(req.params.id)
            .then(movie => res.render('moviesDelete', { movie }));
    },
    destroy: function (req,res) {
        Movies.destroy({
            where: { id: req.params.id }
        }).then(() => res.redirect('/movies'));
    }
}

module.exports = moviesController;