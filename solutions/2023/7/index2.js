const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8").split("\n");
input.pop()

const pairs = []

for (const line of input) {
  const [a, b] = line.split(" ");
  pairs.push([a, parseInt(b)])
}

const cards = "AKQT98765432J"

function getHandStrength(hand, bid) {
  //sort the hand
  const sortedHand = hand.split("").sort().join("")


  const jokerCount = sortedHand.split("").filter(x => x === "J").length

  //are all 5 the same?
  let fiveKind = sortedHand[0] === sortedHand[4]

  //can we remedy this with jokers?
  if (!fiveKind && jokerCount > 0) {

    //is this made up of just jokers and 1 other card?
    const otherCards = sortedHand.split("").filter(x => x !== "J")

    //are all the other cards the same?
    const otherCardsSame = otherCards[0] === otherCards[otherCards.length - 1]

    //if so, we can replace the jokers with the other card
    if (otherCardsSame && 5 - jokerCount == otherCards.length) {
      fiveKind = true
    }
  }

  //are first 4 the same
  let fourKind = sortedHand[0] === sortedHand[3] || sortedHand[1] === sortedHand[4]

  //can we remedy this with jokers?
  if (!fourKind && jokerCount > 0) {
    //whats the element that is repeated the most
    let largestDuplicate = sortedHand.split("").reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr] += 1
      } else {
        acc[curr] = 1
      }
      return acc
    }, {})

    //this is NOT the joker!
    const elemes = Object.entries(largestDuplicate).filter(x => x[0] !== "J").sort((a, b) => b[1] - a[1])

    const largestDuplicateElem = elemes[0][0]

    //do we have enough jokers to make it 4?
    if (jokerCount >= 4 - largestDuplicate[largestDuplicateElem]) {
      fourKind = true

    }
  }



  //are first 3 the same and last 2 the same
  let fullHouse = (sortedHand[0] === sortedHand[2] && sortedHand[3] === sortedHand[4]) || (sortedHand[0] === sortedHand[1] && sortedHand[2] === sortedHand[4])

  //can we remedy this with jokers?
  if (!fullHouse && jokerCount > 0) {
    //how many unqie cards are there?
    const uniqueCards = sortedHand.split("").filter((x, i, a) => a.indexOf(x) == i)

    //if its over 3 othing we cn do
    if (uniqueCards.length === 3 && jokerCount == 1) {
      fullHouse = true
    }

  }

  //3 of a kind
  let threeKind = sortedHand[0] === sortedHand[2] || sortedHand[1] === sortedHand[3] || sortedHand[2] === sortedHand[4]

  //can we remedy this with jokers?
  if (!threeKind && jokerCount > 0) {
    //whats the element that is repeated the most
    let largestDuplicate = sortedHand.split("").reduce((acc, curr) => {
      if (acc[curr]) {
        acc[curr] += 1
      } else {
        acc[curr] = 1
      }
      return acc
    }, {})

    const elemes = Object.entries(largestDuplicate).sort((a, b) => b[1] - a[1])

    const largestDuplicateElem = elemes[0][0]
    //do we have enough jokers to make it 3?
    if (jokerCount >= 3 - largestDuplicate[largestDuplicateElem]) {
      threeKind = true

    }
  }

  //2 pairs
  let twoPair = (sortedHand[0] === sortedHand[1] && sortedHand[2] === sortedHand[3]) || (sortedHand[0] === sortedHand[1] && sortedHand[3] === sortedHand[4]) || (sortedHand[1] === sortedHand[2] && sortedHand[3] === sortedHand[4])


  //1 pair
  let onePair = sortedHand[0] === sortedHand[1] || sortedHand[1] === sortedHand[2] || sortedHand[2] === sortedHand[3] || sortedHand[3] === sortedHand[4]

  //can we remedy this with jokers?
  if (!onePair && jokerCount > 0) {
    //if theres a single joker we can do this
    if (jokerCount === 1) {
      onePair = true
    }
  }

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

console.log(pairs)
console.log(pairs.map(x => getHandStrength(x[0], x[1])))

let sum = 0;

for (let i = 0; i < pairs.length; i++) {
  sum += pairs[i][1] * (i + 1)
}

console.log(sum)