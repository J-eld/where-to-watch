const axios = require('axios');

export default async (req, res) => {

    let streams = {}
    const streamingProviders = await axios.get(`https://api.themoviedb.org/3/movie/${req.query.id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_API_KEY}`)
    for (const country in streamingProviders.data.results) {
        streams[country] = streamingProviders.data.results[country].flatrate
    }

    let movieInfo = {}
    const movie = await axios.get(`https://api.themoviedb.org/3/movie/${req.query.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`)
    movieInfo.title = movie.data.title
    movieInfo.overview = movie.data.overview
    movieInfo.poster_path = movie.data.poster_path
    movieInfo.streams = streams

    const result = await axios.get('https://geolocation-db.com/json/')
    movieInfo.localCountry = result.data.country_code

    console.log(movieInfo)

    res.status(200).send(movieInfo)

}