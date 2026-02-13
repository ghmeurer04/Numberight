import CardList from '../components/CardList'
import Popup from '../components/Popup'
import { useEffect, useState } from 'react'
import { getJSONInfo, getHighscore, saveHighscore, sliceCities, type Item, summarizeNumber } from '../functions'
import { Link } from 'react-router-dom'

function generateRounds(allCities: Item[], count: number) {
    const rounds: Item[][] = []
    for (let i = 0; i < count; i++) {
        rounds.push(sliceCities(allCities, 10))
    }
    return rounds
}

function Game() {
    const [allCities, setAllCities] = useState<Item[]>([])
    const [rounds, setRounds] = useState<Item[][]>([])
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [highscore, setHighscore] = useState(getHighscore())
    const [feedback, setFeedback] = useState<{
        color: string,
        message: string
    } | null>(null)
    const [isLocked, setIsLocked] = useState(false)

    useEffect(() => {
        let isMounted = true
        ;(async () => {
            const cities = (await getJSONInfo())
            if (!isMounted) return
            setAllCities(cities)
            setRounds(generateRounds(cities, 10))
        })()
        return () => {
            isMounted = false
        }
    }, [])

    function handleGuess(guess: Item) {
        if (isLocked) return
        setIsLocked(true)
        const options = rounds[current]
        const other = options.find(o => o.Description + " " + o.Name !== guess.Description + " " + guess.Name)!
        const guessNumber = summarizeNumber(guess.Number)
        const otherNumber = summarizeNumber(other.Number)
        setCurrent(current + 1)
        if (guess.Number >= other.Number) {
            setFeedback({
                color: 'bg-green-600',
                message: `Correct!\n${guess.Description + " " + guess.Name}: ${guessNumber}\n${other.Description + " " + other.Name}: ${otherNumber}`,
            })
            setScore(score + 1)
        } else {
            setFeedback({
                color: 'bg-red-600',
                message: `Wrong!\n${guess.Description + " " + guess.Name}: ${guessNumber}\n${other.Description + " " + other.Name}: ${otherNumber}`,
            })
            const savedHighscore = getHighscore()
            if (current > savedHighscore) {
                setHighscore(current)
                saveHighscore(current)
            }

        }
    }

    function handleFeedbackClose() {
        setFeedback(null)
        setIsLocked(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            {feedback && <Popup color={feedback.color} message={feedback.message} onClick={handleFeedbackClose} />}
            <div className="w-full max-w-4xl">
                <div>
                <Link
                    to="/"
                    className="text-6xl font-bold mb-6 fixed-top box-decoration-clone bg-linear-to-r">
                    Numberight
                </Link>
                </div>
                <div className="font-bold mb-6 mt-5 text-bottom">
                        Which Number 🔢 you think is larger? <br/>
                        Click on the Item you think is the right answer.
                        </div>
                <div className="text-2xl font-bold mb-6 fixed-top">🎯 Score: {score} / {rounds.length}</div>
                <div className="flex flex-col md:flex-row gap-6">
                    {rounds.length > 0 && rounds[current] ? (
                        <CardList
                            key={rounds[current]?.map((Item) => Item.Description + " " + Item.Name).join('|')}
                            className="card-list-enter"
                            options={rounds[current]}
                            onClick={(Item) => handleGuess(Item)}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Game;
