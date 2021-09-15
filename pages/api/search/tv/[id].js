const axios = require('axios');

export default async (req, res) => {

    let streams = {}
    const streamingProviders = await axios.get(`https://api.themoviedb.org/3/tv/${req.query.id}/watch/providers?api_key=${process.env.NEXT_PUBLIC_API_KEY}`)
    for (const country in streamingProviders.data.results) {
        streams[country] = streamingProviders.data.results[country].flatrate
    }

    let showInfo = {}
    const show = await axios.get(`https://api.themoviedb.org/3/tv/${req.query.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`)
    showInfo.title = show.data.name
    showInfo.overview = show.data.overview
    showInfo.poster_path = show.data.poster_path
    showInfo.streams = streams

    const result = await axios.get('https://geolocation-db.com/json/')
    showInfo.localCountry = result.data.country_code

    console.log(showInfo)

    res.status(200).send(showInfo)

}