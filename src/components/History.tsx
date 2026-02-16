import { normalize, type Item } from "../functions"

export type RoundResult = {
    round: number
    items: Item[]
    correctKey: string
    wasCorrect: boolean
}

interface Props {
    history: RoundResult[]
}

function History({ history }: Props) {
    return (<div className="text-left space-y-4 max-h-[60vh] overflow-auto pr-2">
            {history.map((round) => (
                <div key={`round-${round.round}`} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                    <div className="font-semibold mb-3 flex items-center justify-between">
                        <span>Round {round.round} {round.wasCorrect ? "✅" : "❌"}</span>
                    </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            {round.items.map((item) => {
                                const itemKey = normalize(item.Description + " " + item.Name)
                                const isCorrect = itemKey === round.correctKey
                                return (<div
                                            key={itemKey}
                                            className={`flex items-center gap-4 rounded-xl border-2 p-3 ${isCorrect ? 'border-green-500 bg-green-900/30' : 'border-red-500 bg-red-900/30'}`}>
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
                                                <div className="text-sm">Number: {item.Number.toLocaleString()}</div>
                                                <div className="text-xs break-all text-white/70">Source: {item.Source}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>)
}

export default History;
