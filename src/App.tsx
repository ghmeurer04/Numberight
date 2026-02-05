import './App.css'
import CardList from './components/CardList'
import { getCitiesInfo, sliceCities, type City} from './functions'
import { useEffect, useState } from 'react'

function generateRounds(allCities: City[], count: number) {
    const rounds: City[][] = []
    for (let i = 0; i < count; i++) {
        rounds.push(sliceCities(allCities, 2))
    }
    return rounds
}

function App() {
    const [allCities, setAllCities] = useState<City[]>([])
    const [rounds, setRounds] = useState<City[][]>([])
    const [current, setCurrent] = useState(0)
    const [feedback, setFeedback] = useState<{
        type: 'correct' | 'wrong'
        message: string
    } | null>(null)
    const [isLocked, setIsLocked] = useState(false)

    useEffect(() => {
        let isMounted = true
        ;(async () => {
            const cities = (await getCitiesInfo()).filter(city => city.population > 10000)
            if (!isMounted) return
            setAllCities(cities)
            setRounds(generateRounds(cities, 10))
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
                type: 'correct',
                message: `Correct! ${guess.name} has a population of ${guess.population} while ${other.name} has ${other.population}`,
            })
            setCurrent(current + 1)
        } else {
            setFeedback({
                type: 'wrong',
                message: `Wrong! ${guess.name} has a population of ${guess.population} while ${other.name} has ${other.population}`,
            })
            setCurrent(0)
        }

        // Show feedback briefly, then advance to the next round
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
            {feedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    <div
                        className={[
                            'relative px-6 py-4 rounded-lg shadow-lg text-white text-lg',
                            feedback.type === 'correct' ? 'bg-green-600' : 'bg-red-600',
                        ].join(' ')}
                    >
                        {feedback.message}
                    </div>
                </div>
            )}
            <div className="w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-6 fixed-top box-decoration-clone bg-linear-to-r">Numberight</h1>
                <div className="mb-6">Which City 🏙️ has MORE inhabitants?
                                    Click on the city you think is larger.</div>
                <div className="text-2xl font-bold mb-6 fixed-top">🎯 Current Score: {current}</div>
                <div className="flex flex-col md:flex-row gap-6">
                    {rounds.length > 0 && (
                        <CardList
                            key={rounds[current]?.map((city) => city.name).join('|')}
                            className="card-list-enter"
                            options={rounds[current]}
                            onClick={(city) => handleGuess(city)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default App
