// getReactionDescription tells the player how they did based on their average time.
// "average" is their average reaction time in milliseconds — lower is faster!
//
//   Under 180ms  = elite
//   180–220ms    = very fast
//   220–270ms    = above average
//   270–350ms    = average
//   Over 350ms   = slow
//
// Write a message for each speed. Make them as long or funny as you want!
function getReactionDescription(average) {
    if (average < 180) {
        return "your message here";
    } else if (average < 220) {
        return "your message here";
    } else if (average < 270) {
        return "your message here";
    } else if (average < 350) {
        return "your message here";
    } else {
        return "your message here";
    }
}

// getRoundMessage shows a message on screen while the player waits for green.
// "round" is the current round number: 1, 2, or 3.
//
// Write a different message for each round!
function getRoundMessage(round) {
    if (round === 1) {
        return "your message here";
    } else if (round === 2) {
        return "your message here";
    } else {
        return "your message here";
    }
}
