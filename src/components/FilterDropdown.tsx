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
      className="px-3 py-2 rounded-lg border border-neutral-300 bg-white focus:outline-none">
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

export default FilterDropdown