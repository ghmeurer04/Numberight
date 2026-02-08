import {normalize, type City} from '../functions';

interface Props{
    options: City[],
    onClick?: (item: City) => void
    className?: string
}

function CardList({options, onClick, className }: Props){
    return (
        <div className={['flex flex-col md:flex-row gap-12', className].filter(Boolean).join(' ')}>
            {options.map((item) => (<div onClick={() => onClick?.(item)}
                className="group flex-1 rounded-3xl shadow-md overflow-hidden h-158 w-120 relative transform transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                key={normalize(item.name)} style={{ backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/50" />
                <div className="relative z-10 p-6 flex items-end justify-center h-full">
                  <h2 className="text-xl font-semibold text-white transition-transform duration-300 group-hover:-translate-y-1">{item.name} - {item.state}</h2>
                </div>
            </div>))}
        </div>
    )
}

export default CardList;
