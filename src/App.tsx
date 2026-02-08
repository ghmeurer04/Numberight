import './App.css'
import {Route, Routes } from 'react-router-dom'
import background from '../database/background2.webp'
import Game from './pages/Game'
import Home from './pages/HomePage'

function App() {
    return (
        <div
            className="min-h-screen w-full text-white"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/play" element={<Game />} />
            </Routes>
        </div>
    )
}

export default App
