import { SelectedOptionInterface } from '../interfaces/global'

interface CountriesSelectedOptionInterface extends SelectedOptionInterface {
  region: string
  flag: string
}

export const countries: CountriesSelectedOptionInterface[] = [
  { name: 'Canada', code: 'CA', region: 'Americas', flag: '🇨🇦' },
  { name: 'United States', code: 'US', region: 'Americas', flag: '🇺🇸' },
]

export const states: SelectedOptionInterface[] = [
  { name: 'Select', code: 'all' },
  { name: 'Alabama', code: 'AL' },
  { name: 'Alaska', code: 'AK' },
  { name: 'Arizona', code: 'AZ' },
  { name: 'Arkansas', code: 'AR' },
  { name: 'California', code: 'CA' },
  { name: 'Colorado', code: 'CO' },
  { name: 'Connecticut', code: 'CT' },
  { name: 'Delaware', code: 'DE' },
  { name: 'Florida', code: 'FL' },
  { name: 'Georgia', code: 'GA' },
  { name: 'Hawaii', code: 'HI' },
  { name: 'Idaho', code: 'ID' },
  { name: 'Illinois', code: 'IL' },
  { name: 'Indiana', code: 'IN' },
  { name: 'Iowa', code: 'IA' },
  { name: 'Kansas', code: 'KS' },
  { name: 'Kentucky', code: 'KY' },
  { name: 'Louisiana', code: 'LA' },
  { name: 'Maine', code: 'ME' },
  { name: 'Maryland', code: 'MD' },
  { name: 'Massachusetts', code: 'MA' },
  { name: 'Michigan', code: 'MI' },
  { name: 'Minnesota', code: 'MN' },
  { name: 'Mississippi', code: 'MS' },
  { name: 'Missouri', code: 'MO' },
  { name: 'Montana', code: 'MT' },
  { name: 'Nebraska', code: 'NE' },
  { name: 'Nevada', code: 'NV' },
  { name: 'New Hampshire', code: 'NH' },
  { name: 'New Jersey', code: 'NJ' },
  { name: 'New Mexico', code: 'NM' },
  { name: 'New York', code: 'NY' },
  { name: 'North Carolina', code: 'NC' },
  { name: 'North Dakota', code: 'ND' },
  { name: 'Ohio', code: 'OH' },
  { name: 'Oklahoma', code: 'OK' },
  { name: 'Oregon', code: 'OR' },
  { name: 'Pennsylvania', code: 'PA' },
  { name: 'Rhode Island', code: 'RI' },
  { name: 'South Carolina', code: 'SC' },
  { name: 'South Dakota', code: 'SD' },
  { name: 'Tennessee', code: 'TN' },
  { name: 'Texas', code: 'TX' },
  { name: 'Utah', code: 'UT' },
  { name: 'Vermont', code: 'VT' },
  { name: 'Virginia', code: 'VA' },
  { name: 'Washington', code: 'WA' },
  { name: 'West Virginia', code: 'WV' },
  { name: 'Wisconsin', code: 'WI' },
  { name: 'Wyoming', code: 'WY' },
]

export const months: SelectedOptionInterface[] = [
  { name: 'January', code: 'Jan.' },
  { name: 'February', code: 'Feb.' },
  { name: 'March', code: 'Mar.' },
  { name: 'April', code: 'Apr.' },
  { name: 'May', code: 'May' },
  { name: 'June', code: 'Jun.' },
  { name: 'July', code: 'Jul.' },
  { name: 'August', code: 'Aug.' },
  { name: 'September', code: 'Sep.' },
  { name: 'October', code: 'Oct.' },
  { name: 'November', code: 'Nov.' },
  { name: 'December', code: 'Dec.' },
]
export const days: SelectedOptionInterface[] = [
  { name: '01', code: 'one' },
  { name: '02', code: 'two' },
  { name: '03', code: 'three' },
  { name: '04', code: 'four' },
  { name: '05', code: 'five' },
  { name: '06', code: 'six' },
  { name: '07', code: 'seven' },
  { name: '08', code: 'eight' },
  { name: '09', code: 'nine' },
  { name: '10', code: 'ten' },
  { name: '11', code: 'eleven' },
  { name: '12', code: 'twelve' },
  { name: '13', code: 'thirteen' },
  { name: '14', code: 'fourteen' },
  { name: '15', code: 'fifteen' },
  { name: '16', code: 'sixteen' },
  { name: '17', code: 'seventeen' },
  { name: '18', code: 'eighteen' },
  { name: '19', code: 'nineteen' },
  { name: '20', code: 'twenty' },
  { name: '21', code: 'twenty-one' },
  { name: '22', code: 'twenty-two' },
  { name: '23', code: 'twenty-three' },
  { name: '24', code: 'twenty-four' },
  { name: '25', code: 'twenty-five' },
  { name: '26', code: 'twenty-six' },
  { name: '27', code: 'twenty-seven' },
  { name: '28', code: 'twenty-eight' },
  { name: '29', code: 'twenty-nine' },
  { name: '30', code: 'thirty' },
  { name: '31', code: 'thirty-one' },
]

export const years: SelectedOptionInterface[] = Array.from({ length: 116 }, (_, index) => {
  const currentYear = new Date().getFullYear()
  const year = currentYear - 16 - index
  return { name: year.toString(), code: year.toString() }
})

export const accountTypes: SelectedOptionInterface[] = [
  { name: 'Checking', code: 'Checking' },
  { name: 'Savings', code: 'Savings' },
]
