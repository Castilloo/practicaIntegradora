const db = require('../database/models');
const borrador = {
        allMovies: () => {
            db.Movie.findAll()
                .then(movies => console.log(movies))
                .catch(err => new Error(err));
        },
        allActors: () => {
            db.Actor.findAll()
                .then(actors => console.log(actors))
                .catch(err => new Error(err));
        },
        allGenres: () => {
            db.Genre.findAll()
                .then(genres => console.log(genres))
                .catch(err => new Error(err));
        },
        allMovies_genres: () => {
            db.Movie.findAll({
                include: [{association: "generos"}]
            }).then(result => console.log(result));
        }
}

// borrador.allMovies();
// borrador.allGenres();
// borrador.allActors();
borrador.allMovies({
    where: {
        [db.Sequelize.Op.is]:[
            {release_date: null}
        ]
    }
});
