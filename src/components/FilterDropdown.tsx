import type React from "react"

type Props = {
  options: string[]
  value: string
  onChange: (val: string) => void
}

const FilterDropdown = ({ options, value, onChange }: Props) : React.ReactNode => {
  return (
    <select value={value}
      onChange={(e) => onChange(e.target.value)}
      className="py-1 px-1 rounded-lg border border-neutral-300 bg-white focus:outline-none">
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
        </option>
      ))}
    </select>
  )
}

export default FilterDropdown