import CardList from '../components/CardList'
import Popup from '../components/Popup'
import { useEffect, useState } from 'react'
import { getCitiesInfo, getHighscore, saveHighscore, sliceCities, type City } from '../functions'
import { Link } from 'react-router-dom'

function generateRounds(allCities: City[], count: number) {
    const rounds: City[][] = []
    for (let i = 0; i < count; i++) {
        rounds.push(sliceCities(allCities, 2))
    }
    return rounds
}

function Game() {
    const [allCities, setAllCities] = useState<City[]>([])
    const [rounds, setRounds] = useState<City[][]>([])
    const [current, setCurrent] = useState(0)
    const [highscore, setHighscore] = useState(getHighscore())
    const [feedback, setFeedback] = useState<{
        color: string,
        message: string
    } | null>(null)
    const [isLocked, setIsLocked] = useState(false)

    useEffect(() => {
        let isMounted = true
        ;(async () => {
            const cities = (await getCitiesInfo()).filter(city => city.population > 100000)
            if (!isMounted) return
            setAllCities(cities)
            setRounds(generateRounds(cities, 100))
        })()
        return () => {
            isMounted = false
        }
    }, [])

    function handleGuess(guess: City) {
        if (isLocked) return
        setIsLocked(true)
        const options = rounds[current]
        const other = options.find(o => o.name !== guess.name)!
        if (guess.population >= other.population) {
            setFeedback({
                color: 'bg-green-600',
                message: `Correct!\n${guess.name}: ${(guess.population/1000).toFixed(1) + "k"}\n${other.name}: ${(other.population/1000).toFixed(1) + "k"}`,
            })
            setCurrent(current + 1)
        } else {
            setFeedback({
                color: 'bg-red-600',
                message: `Wrong!\n${guess.name}: ${(guess.population/1000).toFixed(1) + "k"}\n${other.name}: ${(other.population/1000).toFixed(1) + "k"}`,
            })
            const savedHighscore = getHighscore()
            if (current > savedHighscore) {
                setHighscore(current)
                saveHighscore(current)
            }
            setCurrent(0)
        }

        setTimeout(() => {
            setFeedback(null)
            setRounds((prev) => {
                const next = [...prev]
                next[current] = sliceCities(allCities, 2)
                return next
            })
            setIsLocked(false)
        }, 3000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            {feedback && <Popup color={feedback.color} message={feedback.message} />}
            <div className="w-full max-w-4xl">
                <div>
                <Link
                    to="/"
                    className="text-6xl font-bold mb-6 fixed-top box-decoration-clone bg-linear-to-r">
                    Numberight
                </Link>
                </div>
                <div className="font-bold mb-6 mt-5 text-bottom">
                        Which city 🏙️ has the largest population?
                        Click on the city you think is the right answer.
                        </div>
                <div className="text-2xl font-bold mb-6 fixed-top">🔥 High Score: {highscore}</div>
                <div className="text-2xl font-bold mb-6 fixed-top">🎯 Current Score: {current}</div>
                <div className="flex flex-col md:flex-row gap-6">
                    {rounds.length > 0 && rounds[current] ? (
                        <CardList
                            key={rounds[current]?.map((city) => city.name).join('|')}
                            className="card-list-enter"
                            options={rounds[current]}
                            onClick={(city) => handleGuess(city)}
                        />
                    ) : (
                        <Popup color="bg-blue-600" message="Congratulations!!\nYou beat all the rounds.\nRefresh to play again." />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Game;