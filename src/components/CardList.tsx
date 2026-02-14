import {normalize, type Item} from '../functions';

interface Props{
    options: Item[],
    onClick?: (item: Item) => void
    className?: string
}

function CardList({options, onClick, className }: Props){
    return (
        <div className={['flex gap-12', className].filter(Boolean).join(' ')}>
            {options.map((item) => (<div onClick={() => onClick?.(item)}
                className="group flex-1 rounded-3xl shadow-md overflow-hidden h-158 w-240 relative transform transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                key={normalize(item.Description + " " + item.Name)}>
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: item.DescriptionImage ? `url(${item.DescriptionImage})` : undefined,
                            clipPath: "polygon(0 0, 100% 0, 0 100%)",
                            backgroundPosition: "100%",
                            backgroundSize: "50% auto"
                        }}
                    />
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: item.NameImage ? `url(${item.NameImage})` : undefined,
                            clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                            backgroundPosition: "500%",
                            backgroundSize: "80% auto"
                        }}
                    />
                </div>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/50" />
                <div className="relative z-10 p-6 flex items-end justify-center h-full">
                  <h2 className="text-xl font-semibold text-white transition-transform duration-300 group-hover:-translate-y-1">{item.Description + " " + item.Name}</h2>
                </div>
            </div>))}
        </div>
    )
}

export default CardList;
