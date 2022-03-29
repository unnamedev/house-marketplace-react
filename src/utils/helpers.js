/**
 * Format a number as a price
 * @param number - The number to format.
 */
export const formatPrice = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")