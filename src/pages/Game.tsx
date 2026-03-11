import CardList from '../components/CardList'
import Popup from '../components/Popup'
import { useEffect, useState } from 'react'
import { getHighscore, normalize, saveHighscore, getRounds, type Item, summarizeNumber } from '../functions'
import { Link } from 'react-router-dom'
import background from '../../database/background.webp'
import History, { type RoundResult } from '../components/History'

interface Props {
    mode: 'regular' | 'hard'
}

<<<<<<< HEAD
type RoundResult = {
    round: number
    items: Item[]
    correctKey: string
}

function Game() {
=======
function Game({ mode }: Props) {
>>>>>>> 7a44e2b992452fa0982db71e6ecec765eae5c95b
    const [rounds, setRounds] = useState<Item[][]>([])
    const [history, setHistory] = useState<RoundResult[]>(localStorage.getItem(mode + '-history') ? JSON.parse(localStorage.getItem(mode + '-history') as string) : [])
    const [current, setCurrent] = useState(history.length)
    const [score, setScore] = useState(history.filter(h => h.wasCorrect).length)
    const [feedback, setFeedback] = useState<{
        color: string,
        message: string
    } | null>(null)
    const [isLocked, setIsLocked] = useState(false)

    useEffect(() => {
        let isMounted = true
        ;(async () => {
            if (!isMounted) return
<<<<<<< HEAD
            setRounds(generateRounds(cities, 10))
=======
            setRounds(await getRounds(mode))
>>>>>>> 7a44e2b992452fa0982db71e6ecec765eae5c95b
        })()
        return () => {
            isMounted = false
        }
    }, [mode])

    function handleGuess(guess: Item) {
        if (isLocked) return
        setIsLocked(true)
        const options = rounds[current]
        const other = options.find(o => o.Description + " " + o.Name !== guess.Description + " " + guess.Name)!
        const guessNumber = summarizeNumber(guess.Number)
        const otherNumber = summarizeNumber(other.Number)
        const guessKey = normalize(guess.Description + " " + guess.Name)
        const otherKey = normalize(other.Description + " " + other.Name)
        const wasCorrect = guess.Number >= other.Number
        const correctKey = wasCorrect ? guessKey : otherKey
        setHistory(prev => [...prev, { round: current + 1, items: options, correctKey, wasCorrect }])
        localStorage.setItem(mode + '-history', JSON.stringify([...history, { round: current + 1, items: options, correctKey, wasCorrect }]))
        setCurrent(current + 1)
        if (wasCorrect) {
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
                saveHighscore(current)
            }

        }
    }

    function handleFeedbackClose() {
        setFeedback(null)
        setIsLocked(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white " style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
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
                        Click on the Item you think is the right answer. <br/>
                        🔥 10 Rounds to prove you know more 🔥
                        </div>
                <div className="text-2xl font-bold mb-6 fixed-top">🎯 Score: {score} / {current}</div>
                <div className="flex items-center justify-center">
                    {rounds.length > 0 && current >= rounds.length ? (
                        <div className="w-full rounded-3xl shadow-md p-8 text-center bg-slate-900/90 text-white">
                            <History history={history}></History>
                            <div className="mt-6">
                                <Link
                                    to="/"
                                    className="inline-block px-6 py-3 rounded-2xl bg-white text-slate-900 font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Homepage
                                </Link>
                            </div>
                        </div>
                    ) : rounds.length > 0 && rounds[current] ? (
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
