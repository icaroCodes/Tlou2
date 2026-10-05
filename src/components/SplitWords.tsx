import { Fragment } from 'react'

export function SplitWords({ text, className, wordClassName = '' }: { text: string; className?: string; wordClassName?: string }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="wm" aria-hidden>
            <span className={`w ${wordClassName}`}>{word}</span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  )
}
