
/**
 * Declare the possible interface for a hand
 * @dev Baljeet Bhinder
 * 
 */
export interface Hand {

  value: string | null,
  is_valid: boolean | null,
  denomination: object
}


/**
 * Declare the possible interface for a pair
 * @dev Baljeet Bhinder
 * 
 */
export interface Pair {

  [index:number]:any
}