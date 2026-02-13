import { Link} from 'react-router-dom'

function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-xl text-center text-white">
                <h1 className="text-9xl font-bold mb-4">Numberight</h1>
                <p className="mb-8 text-xl font-semibold">
                    🏙️ Choose the bigger number 🏙️.<br />
                    🎯 Build a streak 🎯.<br />
                    🔥 Beat your high score 🔥.
                </p>
                <Link
                    to="/play"
                    className="inline-flex items-center justify-center rounded-full bg-white/90 px-8 py-3 text-lg font-semibold text-slate-900 shadow-lg transition hover:bg-white"
                >
                    Play
                </Link>
            </div>
        </div>
    )
}

export default Home;