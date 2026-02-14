import CardList from '../components/CardList'
import Popup from '../components/Popup'
import { useEffect, useState } from 'react'
import { getJSONInfo, getHighscore, normalize, saveHighscore, sliceCities, type Item, summarizeNumber } from '../functions'
import { Link } from 'react-router-dom'

function generateRounds(allCities: Item[], count: number) {
    const rounds: Item[][] = []
    for (let i = 0; i < count; i++) {
        rounds.push(sliceCities(allCities, 2))
    }
    return rounds
}

type RoundResult = {
    round: number
    items: Item[]
    correctKey: string
}

function Game() {
    const [allCities, setAllCities] = useState<Item[]>([])
    const [rounds, setRounds] = useState<Item[][]>([])
    const [current, setCurrent] = useState(0)
    const [score, setScore] = useState(0)
    const [history, setHistory] = useState<RoundResult[]>([])
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
        const guessKey = normalize(guess.Description + " " + guess.Name)
        const otherKey = normalize(other.Description + " " + other.Name)
        const correctKey = guess.Number >= other.Number ? guessKey : otherKey
        setHistory(prev => [...prev, { round: current + 1, items: options, correctKey }])
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
                saveHighscore(current)
            }

        }
    }

    function handleFeedbackClose() {
        setFeedback(null)
        setIsLocked(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-white">
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
                <div className="flex items-center justify-center">
                    {rounds.length > 0 && current >= rounds.length ? (
                        <div className="w-full rounded-3xl shadow-md p-8 text-center bg-slate-900/90 text-white">
                            <div className="text-left space-y-4 max-h-[60vh] overflow-auto pr-2">
                                {history.map((round) => (
                                    <div key={`round-${round.round}`} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                                        <div className="font-semibold mb-3">Round {round.round}</div>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {round.items.map((item) => {
                                                const itemKey = normalize(item.Description + " " + item.Name)
                                                const isCorrect = itemKey === round.correctKey
                                                return (
                                                    <div
                                                        key={itemKey}
                                                        className={`flex items-center gap-4 rounded-xl border-2 p-3 ${isCorrect ? 'border-green-500 bg-green-900/30' : 'border-red-500 bg-red-900/30'}`}
                                                    >
                                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/10">
                                                            <div
                                                                className="absolute inset-0 bg-cover bg-center"
                                                                style={{
                                                                    backgroundImage: item.DescriptionImage ? `url(${item.DescriptionImage})` : undefined,
                                                                    clipPath: "polygon(0 0, 100% 0, 0 100%)"
                                                                }}
                                                            />
                                                            <div
                                                                className="absolute inset-0 bg-cover bg-center"
                                                                style={{
                                                                    backgroundImage: item.NameImage ? `url(${item.NameImage})` : undefined,
                                                                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)"
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-semibold">{item.Description + " " + item.Name}</div>
                                                            <div className={`text-sm font-semibold ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                                                                {isCorrect ? 'Correct' : 'Wrong'}
                                                            </div>
                                                            <div className="text-sm">Number: {item.Number.toLocaleString()}</div>
                                                            <div className="text-xs break-all text-white/70">Source: {item.Source}</div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
