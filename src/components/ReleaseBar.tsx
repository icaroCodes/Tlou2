import { Ps5Logo } from './BrandIcons'

export function ReleaseBar({ className = '', onReserve }: { className?: string; onReserve: () => void }) {
  return (
    <div className={`rbar ${className}`}>
      <p className="rbar__date">
        Chega em <span>19 de fevereiro</span> de 2027
      </p>
      <button className="btn-reserve" onClick={onReserve}>
        Pré-venda
      </button>
      <div className="rbar__platforms">
        <Ps5Logo className="rbar__ps5" />
        <span className="rbar__pro">PS5 Pro Enhanced</span>
      </div>
    </div>
  )
}
