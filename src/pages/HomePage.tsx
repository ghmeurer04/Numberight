import { Link} from 'react-router-dom'

function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-xl text-center text-white">
                <h1 className="text-9xl font-bold mb-4">Numberight</h1>
                <p className="mb-8 text-xl font-semibold">
                    🌍 Compare the world 🌍.<br />
                    🔢 Guess the bigger number 🔢.<br />
                    🤔 Seems obvious… or is it? 🤔
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link
                        to="/play"
                        className="inline-flex items-center justify-center rounded-full bg-white/90 px-8 py-3 text-lg font-semibold text-slate-900 shadow-lg transition hover:bg-white"
                    >
                        Regular Mode
                    </Link>
                    <Link
                        to="/play/challenge"
                        className="inline-flex items-center justify-center rounded-full bg-white/90 px-8 py-3 text-lg font-semibold text-slate-900 shadow-lg transition hover:bg-white"
                    >
                        Challenger Mode
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home;