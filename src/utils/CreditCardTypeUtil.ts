export const getCardType = (number: string) => {
  const firstDigit = number[0]
  const firstTwoDigits = number.slice(0, 2)
  const firstFourDigits = number.slice(0, 4)

  if (/^4/.test(firstDigit)) {
    return 'Visa'
  } else if (/^5[1-5]/.test(firstTwoDigits)) {
    return 'MasterCard'
  } else if (/^3[47]/.test(firstTwoDigits)) {
    return 'Amex'
  } else if (/^6(?:011|5)/.test(firstFourDigits)) {
    return 'Discover'
  } else {
    return 'Unknown'
  }
}
