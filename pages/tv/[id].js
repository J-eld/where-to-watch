import React, { useState, useEffect } from 'react'
import styles from '/styles/movieSearch/movieSearch.module.css'
import Header from '/components/Header'
import Container from '@material-ui/core/Container'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'

export default function TV_id() {
    const [streams, setStreams] = useState([])
    const [showInfo, setshowInfo] = useState({});
    const [localCountry, setLocalCountry] = useState('')
    const router = useRouter()
    const {id} = router.query

    useEffect(() => {
        if (id !== undefined) {
            axios.get(`/api/search/tv/${router.query.id}`)
            .then(res => {
                const info = res.data
                setshowInfo(info)
                setStreams(info.streams)
            })
            .catch(err => console.error(err))

            axios.get('https://geolocation-db.com/json/')
            .then(res => setLocalCountry(res.data.country_code))
            .catch(err => console.error(err))
        }
    }, [id])


    return (
        <div className={styles.movieSearchRoot}>
            <Container maxWidth="xl">
                <Header />
                {showInfo.title && (
                <div className={styles.movieSearchBody}>
                    <div className={styles.movieTitle}>
                        {showInfo && showInfo.title}
                    </div>
                    <div className={styles.movieInfo}>
                        <div className={styles.movieImage}>
                            {showInfo && <Image src={`https://image.tmdb.org/t/p/w342${showInfo.poster_path}`} width={342} height={513}/>}
                        </div>
                        <div className={styles.streamingPlatformsAndMovieDescription}>
                            <div className={styles.streamingPlatforms}>
                                <div className={styles.streamingPlatformsTitle}>Streaming Platforms</div>
                                <div className={styles.streamingPlatformsList}>
                                    {streams[localCountry]?.length > 0 
                                    ? 
                                    streams[localCountry].map((platform, index) => (
                                        <div className={styles.streamingPlatform}>
                                            <img src={`https://image.tmdb.org/t/p/w45${platform.logo_path}`}/>
                                            <div className={styles.streamingPlatformName}>{platform.provider_name}</div>
                                        </div>
                                    ))
                                    : 
                                    'This Show is not available to stream in your country :('
                                    }
                                </div>
                            </div>
                            <div className={styles.movieDescription}>
                                <div className={styles.overviewTitle}>Overview</div>
                                {showInfo && showInfo.overview}
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </Container>
        </div>
    )
}
