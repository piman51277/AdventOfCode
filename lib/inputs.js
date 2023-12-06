/**
 * Gets all the regex matches for a given regex and string
 * @param {RegExp} regex
 * @param {string} string
 */
function getRegexMatches(regex, string) {
  return Array.from(string.matchAll(regex));
}

/**
 * Gets all the numbers in a string separated by spaces
 * @param {string} string 
 * @returns 
 */
function getSpaceSeparatedNumbers(string) {
  return string.split(" ").map(Number);
}

/**
 * Gets all the numbers in a string separated by spaces, after removing a prefix
 * @param {string} string The string to get the numbers from
 * @param {string} prefix What to remove from the string before getting the numbers
 * @returns 
 */
function getSpaceSeparatedNumbersWithPrefix(string, prefix) {
  return getSpaceSeparatedNumbers(string.slice(prefix.length));
}