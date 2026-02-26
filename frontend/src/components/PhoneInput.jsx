import { useState, useEffect, useRef } from 'react'

function countryToFlag(iso2) {
  if (!iso2 || iso2.length !== 2) return ''
  return iso2
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('')
}

const COUNTRY_CODES = [
  { code: '91', iso2: 'IN', label: 'India', dial: '+91' },
  { code: '1', iso2: 'US', label: 'United States', dial: '+1' },
  { code: '44', iso2: 'GB', label: 'United Kingdom', dial: '+44' },
  { code: '971', iso2: 'AE', label: 'UAE', dial: '+971' },
  { code: '61', iso2: 'AU', label: 'Australia', dial: '+61' },
  { code: '81', iso2: 'JP', label: 'Japan', dial: '+81' },
  { code: '86', iso2: 'CN', label: 'China', dial: '+86' },
  { code: '49', iso2: 'DE', label: 'Germany', dial: '+49' },
  { code: '33', iso2: 'FR', label: 'France', dial: '+33' },
  { code: '55', iso2: 'BR', label: 'Brazil', dial: '+55' },
  { code: '92', iso2: 'PK', label: 'Pakistan', dial: '+92' },
  { code: '880', iso2: 'BD', label: 'Bangladesh', dial: '+880' },
  { code: '65', iso2: 'SG', label: 'Singapore', dial: '+65' },
  { code: '60', iso2: 'MY', label: 'Malaysia', dial: '+60' },
  { code: '234', iso2: 'NG', label: 'Nigeria', dial: '+234' },
  { code: '27', iso2: 'ZA', label: 'South Africa', dial: '+27' },
  { code: '7', iso2: 'RU', label: 'Russia', dial: '+7' },
  { code: '82', iso2: 'KR', label: 'South Korea', dial: '+82' },
  { code: '31', iso2: 'NL', label: 'Netherlands', dial: '+31' },
  { code: '39', iso2: 'IT', label: 'Italy', dial: '+39' },
  { code: '34', iso2: 'ES', label: 'Spain', dial: '+34' },
  { code: '966', iso2: 'SA', label: 'Saudi Arabia', dial: '+966' },
  { code: '20', iso2: 'EG', label: 'Egypt', dial: '+20' },
  { code: '90', iso2: 'TR', label: 'Turkey', dial: '+90' },
  { code: '62', iso2: 'ID', label: 'Indonesia', dial: '+62' },
  { code: '63', iso2: 'PH', label: 'Philippines', dial: '+63' },
  { code: '84', iso2: 'VN', label: 'Vietnam', dial: '+84' },
]

const DEFAULT_COUNTRY = '91'

function parseValue(value) {
  const digits = (value || '').replace(/\D/g, '')
  if (!digits) return { countryCode: DEFAULT_COUNTRY, nationalNumber: '' }
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length)
  for (const { code } of sorted) {
    if (digits === code || digits.startsWith(code)) {
      return {
        countryCode: code,
        nationalNumber: digits.slice(code.length).replace(/^0+/, ''),
      }
    }
  }
  return { countryCode: DEFAULT_COUNTRY, nationalNumber: digits }
}

export default function PhoneInput({ value = '', onChange, label = 'Phone number', error, required, disabled, className = '', id }) {
  const parsed = parseValue(value)
  const [countryCode, setCountryCode] = useState(parsed.countryCode)
  const [nationalNumber, setNationalNumber] = useState(parsed.nationalNumber)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const p = parseValue(value)
    setCountryCode(p.countryCode)
    setNationalNumber(p.nationalNumber)
  }, [value])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const emitChange = (cc, num) => {
    const digitsOnly = (num || '').replace(/\D/g, '')
    const full = cc && digitsOnly ? cc + digitsOnly : digitsOnly
    onChange?.(full)
  }

  const handleCountrySelect = (cc) => {
    setCountryCode(cc)
    emitChange(cc, nationalNumber)
    setDropdownOpen(false)
  }

  const handleNumberChange = (e) => {
    const raw = e.target.value
    const digitsOnly = raw.replace(/\D/g, '')
    setNationalNumber(digitsOnly)
    emitChange(countryCode, digitsOnly)
  }

  const handleClear = () => {
    setNationalNumber('')
    emitChange(countryCode, '')
  }

  const selected = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0]

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className={`flex rounded-xl border bg-white dark:bg-gray-800 transition-colors focus-within:ring-2 ${
        error
          ? 'border-red-500 dark:border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20 bg-red-50/50 dark:bg-red-900/10'
          : 'border-gray-300 dark:border-gray-600 focus-within:ring-primary-500 focus-within:border-primary-500'
      }`}>
        <div className="relative shrink-0 z-20 rounded-l-xl overflow-visible" ref={dropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!disabled) setDropdownOpen((o) => !o)
            }}
            disabled={disabled}
            className="flex items-center gap-2 pl-3 pr-8 py-2.5 min-w-[120px] w-full rounded-l-xl bg-gray-50 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer touch-manipulation"
            aria-label="Select country"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="text-lg leading-none" aria-hidden>{countryToFlag(selected.iso2)}</span>
            <span>{selected.dial}</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </span>
          </button>
          {dropdownOpen && (
            <div
              className="absolute left-0 top-full mt-1 z-50 w-64 max-h-60 overflow-auto rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg py-1"
              role="listbox"
            >
              {COUNTRY_CODES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  role="option"
                  aria-selected={c.code === countryCode}
                  onClick={() => handleCountrySelect(c.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${c.code === countryCode ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <span className="text-lg leading-none">{countryToFlag(c.iso2)}</span>
                  <span className="font-medium">{c.dial}</span>
                  <span className="text-gray-500 dark:text-gray-400 truncate">{c.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 flex items-center min-w-0 relative rounded-r-xl overflow-hidden">
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="Phone number"
            value={nationalNumber}
            onChange={handleNumberChange}
            disabled={disabled}
            className="flex-1 min-w-0 px-3 py-2.5 pr-10 text-gray-900 dark:text-white bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
          />
          {nationalNumber && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Clear phone number"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
          <span className="shrink-0" aria-hidden>⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}
