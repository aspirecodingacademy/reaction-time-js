# Reaction Lab

## How to Run

Click the **"Go Live"** button in the bottom-right corner of VS Code. Your browser will open to `localhost:5500`.

## Your Tasks

### 1. `my-lab.js` — Set up your lab

- `MY_NAME` — your name
- `LAB_TITLE` — build the title by combining `MY_NAME` with a string using `+`
- `READY_MESSAGE` — the message shown on the start screen

### 2. `messages.js` — Write your messages

- `getReactionDescription(average)` — write a message for each reaction speed (5 tiers, from elite to slow)
- `getRoundMessage(round)` — write a message for each round (shown on screen while the player waits for green)

### 3. `math.js` — Do the math

- `calculateAverage(times)` — calculate the average of all the times
- `getBestTime(times)` — find the fastest (lowest) time
- `getWorstTime(times)` — find the slowest (highest) time

## Make It Yours: Styling

Open `theme.css` and change any value to restyle the game — everything updates automatically. You can change:

- **Colors** — names like `tomato` or hex codes like `#10E575`
- **Font** — pick from the list of ready-to-use fonts in the file
- **Spacing** — adjust the padding inside the round result boxes
- **Shape** — adjust how rounded the corners are
- **Your own rule** — write CSS directly for `.reaction-description` at the bottom of the file

## Bonus Challenge (optional)

**Finished early? Try this!**

You have access to `MY_NAME` in every file. Open `messages.js` and use it inside one of your return strings:

```js
return "Amazing reflexes, " + MY_NAME + "!";
```

Win the game and you should see your name in the results. Try it in a few different messages!
