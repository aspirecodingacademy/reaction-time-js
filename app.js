const TOTAL_ROUNDS = 3;
const WAIT_MIN_MS = 2000;
const WAIT_RANDOM_MS = 1750;

const startScreen = document.getElementById("test-selection");
const playingState = document.getElementById("playing-state");
const resultsState = document.getElementById("results-state");
const startButton = document.getElementById("start-button");
const tryAgainButton = document.getElementById("different-test-button");
const shareButton = document.getElementById("share-button");

const reactionPanel = document.getElementById("reaction-panel");
const hudContent = document.getElementById("hud-content");
const panelPhase = document.getElementById("panel-phase");
const panelInstruction = document.getElementById("panel-instruction");

const averageTime = document.getElementById("average-time");
const reactionPercentile = document.getElementById("reaction-percentile");
const reactionDescription = document.getElementById("reaction-description");
const bestTime = document.getElementById("best-time");
const worstTime = document.getElementById("worst-time");
const roundTimeElements = Array.from(document.querySelectorAll("[data-round-time]"));

document.title = LAB_TITLE;
document.querySelector("h1").textContent = LAB_TITLE;
document.querySelector(".intro").textContent = READY_MESSAGE;

let currentRound = 0;
let phase = "idle"; // "idle" | "waiting" | "ready" | "frozen"
let startTime = 0;
let results = [];
let readyTimeoutId = null;
let transitionTimeoutId = null;

function clearTimers() {
    clearTimeout(readyTimeoutId);
    clearTimeout(transitionTimeoutId);
    readyTimeoutId = null;
    transitionTimeoutId = null;
}

function formatMilliseconds(value) {
    return `${Math.round(value)} ms`;
}

function calculatePercentile(time) {
    const slope = -0.408333;
    const intercept = 164.3333;
    const percentile = slope * time + intercept;
    return Math.round(Math.max(1, Math.min(99, percentile)));
}

function getReactionTime(start) {
    return performance.now() - start;
}

function updateResultsDisplay(average, times) {
    averageTime.textContent = formatMilliseconds(average);
    reactionPercentile.textContent = `Faster than ${calculatePercentile(average)}% of people.`;
    reactionDescription.textContent = getReactionDescription(average);
    bestTime.textContent = formatMilliseconds(getBestTime(times));
    worstTime.textContent = formatMilliseconds(getWorstTime(times));
    for (let i = 0; i < times.length; i++) {
        roundTimeElements[i].textContent = formatMilliseconds(times[i]);
    }
}

function setPanel(className, phaseText, instructionText) {
    reactionPanel.className = `game-panel ${className}`;
    panelPhase.textContent = phaseText;
    panelInstruction.textContent = instructionText;
    hudContent.textContent = currentRound === 0 ? "" : `Round ${currentRound} of ${TOTAL_ROUNDS}`;
}

function startGame() {
    clearTimers();
    startScreen.classList.add("hidden");
    playingState.classList.remove("hidden");
    document.body.classList.add("playing-mode");
    currentRound = 0;
    results = [];
    startRound();
}

// Begins a brand-new round (advances the round counter).
function startRound() {
    currentRound += 1;
    beginAttempt();
}

// Runs the WAIT -> TAP cycle for the current round. Called on a fresh
// round AND on a retry after an early tap, so it must NOT touch currentRound.
function beginAttempt() {
    phase = "waiting";
    setPanel("waiting", "WAIT", getRoundMessage(currentRound));
    const delay = WAIT_MIN_MS + Math.random() * WAIT_RANDOM_MS;
    readyTimeoutId = setTimeout(() => {
        phase = "ready";
        startTime = performance.now();
        setPanel("ready", "TAP!", "");
        readyTimeoutId = null;
    }, delay);
}

function handlePanelClick() {
    // Tapped before green: penalize and retry the SAME round.
    if (phase === "waiting") {
        phase = "frozen";
        clearTimers();
        setPanel("early", "TOO SOON!", "Tap to retry");
        transitionTimeoutId = setTimeout(beginAttempt, 1000);
        return;
    }

    // Valid tap on green: record the time and advance.
    if (phase === "ready") {
        phase = "frozen";
        const reactionTime = getReactionTime(startTime);
        results.push(reactionTime);
        setPanel("result", formatMilliseconds(reactionTime), "");
        transitionTimeoutId = setTimeout(() => {
            if (currentRound < TOTAL_ROUNDS) {
                startRound();
            } else {
                showResults();
            }
        }, 1500);
        return;
    }

    // phase is "frozen" or "idle": ignore clicks during transitions.
}

function showResults() {
    phase = "idle";
    const average = calculateAverage(results);
    updateResultsDisplay(average, results);
    playingState.classList.add("hidden");
    resultsState.classList.remove("hidden");
    document.body.classList.remove("playing-mode");
}

function showStartScreen() {
    clearTimers();
    phase = "idle";
    resultsState.classList.add("hidden");
    startScreen.classList.remove("hidden");
    document.body.classList.remove("playing-mode");
    currentRound = 0;
    results = [];
}

startButton.addEventListener("click", startGame);
tryAgainButton.addEventListener("click", showStartScreen);
reactionPanel.addEventListener("click", handlePanelClick);

shareButton.addEventListener("click", async () => {
    const average = calculateAverage(results);
    const percentile = calculatePercentile(average);
    const shareText = `My reaction time is ${formatMilliseconds(average)}. Faster than ${percentile}% of people! What's yours?`;
    if (navigator.share) {
        try {
            await navigator.share({ title: LAB_TITLE, text: shareText, url: window.location.href });
        } catch (error) {
            if (error.name !== "AbortError") console.error("Share failed:", error);
        }
        return;
    }
    try {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        shareButton.textContent = "Copied!";
        setTimeout(() => { shareButton.textContent = "Share"; }, 2000);
    } catch (error) {
        console.error("Failed to copy:", error);
    }
});
