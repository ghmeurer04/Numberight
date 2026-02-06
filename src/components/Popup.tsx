interface Props{
    color: string,
    message: string
}

function Popup({color, message}: Props){
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-white shadow-2xl ring-1 ring-white/10">
                <div className={'h-1.5 w-full ' + color} />
                <div className="px-6 py-5 text-lg leading-relaxed whitespace-pre-line">
                    {message}
                </div>
            </div>
        </div>
    )
}

export default Popup;
