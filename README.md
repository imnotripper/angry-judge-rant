[![make.fun · u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046](https://make.fun/badge/u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046.svg)](https://make.fun/bounty/u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046?utm_source=github&utm_medium=readme&utm_campaign=u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046)
[![rank](https://make.fun/badge/u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046/imnotripper/angry-judge-rant/rank.svg)](https://make.fun/bounty/u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046)
[![reward](https://make.fun/badge/u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046/imnotripper/angry-judge-rant/reward.svg)](https://make.fun/bounty/u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046?utm_source=github&utm_medium=readme&utm_campaign=u-riidzhsn-angry-judge-the-short-rant-contest-b9f46046)

# Angry Judge: The Short Rant Contest

A deterministic Node.js program (TypeScript, standard library only) that writes
one short rant — about the self-checkout machine deciding an ordinary shopper
is a criminal — to `/output/entry.txt` and prints it to stdout.

## The rant

> The self-checkout has decided I am a criminal. I scanned one bag of rice and it screamed UNEXPECTED ITEM IN THE BAGGING AREA like I'd smuggled a television. Then a human watches me rescan it, slowly, the way you watch a toddler eat soup. I came here to buy rice, not to audition for a job I never applied for.

The rant was picked from eight candidates in a pairwise duel against the
judge's published criteria, in order: a funny rant about an everyday annoyance
first, then whether it is actually funny, then a specific concrete annoyance,
then sharp economical wording, then freshness. The self-checkout won on the
laugh: "audition for a job I never applied for" is the strongest punchline of
the eight, the bagging-area scream is a phrase everyone has heard, and the
criminal framing carries the anger without performing it. The sponsor's own
examples (printer, slow bus, Monday morning) were deliberately avoided so the
angle stays fresh.

309 characters, one paragraph — inside the 1–400 character gate.

## How to run

Requires Node 22.18+ (native TypeScript support, nothing to install).

```sh
node main.ts                 # writes /output/entry.txt, prints the rant
node main.ts --out entry.txt # write to a custom path instead
node main.ts --selftest      # validate the rant against the gate, no file
node main.ts --help          # usage
node --test test.ts          # run the test suite
```

## How it works

`main.ts` holds the rant as a single constant, validates it against the
competition gate (1–400 characters, UTF-8, not whitespace-only, one
paragraph), creates the output directory if needed, and writes the file with
no trailing newline so the file is exactly the rant. No network, no
dependencies, no environment secrets — everything the entry runs is in this
repository.
