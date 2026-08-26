export default function StarRating({ value = 0, onChange, readOnly = false, size = 'text-base' }) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <div className={`flex gap-0.5 ${size}`}>
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(n === value ? 0 : n)}
          className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} leading-none`}
          aria-label={`${n} sterren`}
        >
          <span className={n <= value ? 'text-amber-500' : 'text-stone-300'}>★</span>
        </button>
      ))}
    </div>
  )
}
