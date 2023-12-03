/**
 * Gets all the regex matches for a given regex and string
 * @param {RegExp} regex
 * @param {string} string
 */
function getRegexMatches(regex, string) {
  return Array.from(string.matchAll(regex));
}