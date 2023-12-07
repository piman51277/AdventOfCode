const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const pairs = []

for (const line of input) {
  const [a, b] = line.split(" ");
  pairs.push([a, parseInt(b)])
}

const cards = "AKQJT98765432"

function getHandStrength(hand, bid) {
  //sort the hand
  const sortedHand = hand.split("").sort().join("")

  //are all 5 the same?
  const fiveKind = sortedHand[0] === sortedHand[4]

  //are first 4 the same
  const fourKind = sortedHand[0] === sortedHand[3] || sortedHand[1] === sortedHand[4]

  //are first 3 the same and last 2 the same
  const fullHouse = (sortedHand[0] === sortedHand[2] && sortedHand[3] === sortedHand[4]) || (sortedHand[0] === sortedHand[1] && sortedHand[2] === sortedHand[4])

  //3 of a kind
  const threeKind = sortedHand[0] === sortedHand[2] || sortedHand[1] === sortedHand[3] || sortedHand[2] === sortedHand[4]

  //2 pairs
  const twoPair = (sortedHand[0] === sortedHand[1] && sortedHand[2] === sortedHand[3]) || (sortedHand[0] === sortedHand[1] && sortedHand[3] === sortedHand[4]) || (sortedHand[1] === sortedHand[2] && sortedHand[3] === sortedHand[4])

  //1 pair
  const onePair = sortedHand[0] === sortedHand[1] || sortedHand[1] === sortedHand[2] || sortedHand[2] === sortedHand[3] || sortedHand[3] === sortedHand[4]

  //high card
  let highCard = true
  for (let i = 0; i < sortedHand.length - 1; i++) {
    if (sortedHand[i] === sortedHand[i + 1]) {
      highCard = false
    }
  }

  if (fiveKind) {
    return 1000
  } else if (fourKind) {
    return 500
  } else if (fullHouse) {
    return 350
  } else if (threeKind) {
    return 250
  } else if (twoPair) {
    return 150
  } else if (onePair) {
    return 50
  } else {
    return 0
  }
}


function comparePair(pair1, pair2) {
  const [hand1, bid1] = pair1
  const [hand2, bid2] = pair2
  const hand1Strength = getHandStrength(hand1, bid1)
  const hand2Strength = getHandStrength(hand2, bid2)

  if (hand1Strength > hand2Strength) {
    return 1
  } else if (hand1Strength < hand2Strength) {
    return -1
  } else {
    //go down the line and compare the cards
    for (let i = 0; i < hand1.length; i++) {
      if (cards.indexOf(hand1[i]) < cards.indexOf(hand2[i])) {
        return 1
      } else if (cards.indexOf(hand1[i]) > cards.indexOf(hand2[i])) {
        return -1
      }
    }
  }

  return 0
}


//sort the pairs
pairs.sort(comparePair)

let sum = 0;

for (let i = 0; i < pairs.length; i++) {
  sum += pairs[i][1] * (i + 1)
}

console.log(sum)