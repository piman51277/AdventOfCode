/**
 * This section is simplified poker, like in AOC 2023 Day 7
 */


//a few examples of card strings
const aceTop = "AJKQ23456789";
const aceBottom = "AJKQ23456789";
const jokerAceTop = "AJKQ23456789T";
const jokerAceBottom = "AJKQ23456789T";

const kinds = [
  "FiveKind",
  "FourKind",
  "FullHouse",
  "ThreeKind",
  "TwoPair",
  "OnePair",
  "HighCard"
]

function getKind(hand, cardString = aceTop) {

  //first sort the hand
  hand.split("").sort((a, b) => cardString.indexOf(a) - cardString.indexOf(b)).join("");

  //get the number of each card
  const cardCounts = {};
  for (const card of hand) {
    cardCounts[card] = (cardCounts[card] || 0) + 1;
  }

  const cardCountEntries = Object.entries(cardCounts);

  //5 of a kind
  if (cardCountEntries.some(([card, count]) => count >= 5)) return "FiveKind";

  //4 of a kind
  if (cardCountEntries.some(([card, count]) => count >= 4)) return "FourKind";

  //full house
  if (cardCountEntries.some(([card, count]) => count >= 3) && cardCountEntries.some(([card, count]) => count >= 2)) return "FullHouse";

  //3 of a kind
  if (cardCountEntries.some(([card, count]) => count >= 3)) return "ThreeKind";

  //2 pair
  if (cardCountEntries.filter(([card, count]) => count >= 2).length >= 2) return "TwoPair";

  //1 pair
  if (cardCountEntries.some(([card, count]) => count >= 2)) return "OnePair";


  //high card
  return "HighCard";
}