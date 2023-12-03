import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

const today = new Date();

const prompt = `Day to run (${today.getDate()}): `
let day: number | null = null;

do {
  process.stdout.write(prompt);
  const line = await getInput();
  if (!line) {
    day = today.getDate();
  } else if (parseInt(line)) {
    day = parseInt(line);
  } else {
    console.log('Must enter a valid day');
  }
} while (!day);

if (existsSync(`2023/${day}`)) {
  const proc = Bun.spawn(['bun', 'run', `2023/${day}/solution.ts`]);
  const output = await new Response(proc.stdout).text();
  await proc.exited;
  
  console.log(output);
} else {
  process.stdout.write('That day does not exist, should I set it up? [(y), n]: ');
  const answer = await getInput() || 'y';
  if (answer?.toLowerCase() === 'y') {
    await createExerciseDay(day);
  }
}

process.exit(0);

async function getInput() {
  for await (const line of console) {
    return line;
  }
}

async function createExerciseDay(day: number) {
  const emptyFiles = [
    'input.txt',
    'problem.md',
  ];
  
  await mkdir(`2023/${day}`, { recursive: true });

  for (const emptyFile of emptyFiles) {
    const file = Bun.file(`2023/${day}/${emptyFile}`);
    await Bun.write(file, '');
    console.log(`Created file: 2023/${day}/${emptyFile}`);
  }

  const solutionFile = Bun.file(`2023/${day}/solution.ts`);
  const testFile = Bun.file(`2023/${day}/solution.test.ts`);

  await Bun.write(solutionFile, 
`const showWork = Bun.env.SHOW_WORK === 'true';
const file = Bun.file('2023/${day}/input.txt');
const input = await file.text();
const part1Answer = part1(input);
const part2Answer = part2(input);
console.log('Part 1: ' + part1Answer);
console.log('Part 2: ' + part2Answer);

export function part1(input) {
  return null;
}

export function part2(input) {
  return null;
}
`);
console.log(`Created file: 2023/${day}/solution.ts`);

await Bun.write(testFile,
`import { describe, expect, test } from "bun:test";
import { part1, part2 } from "./solution";

describe('Day ${day}', () => {
  const exampleInput = null;

  test('returns the correct output for part 1', () => {
    expect(part1(exampleInput)).not.toBeNull();
  });

  test('returns the correct output for part 2', () => {
    expect(part2(exampleInput)).not.toBeNull();
  });
});
`)
console.log(`Created file: 2023/${day}/solution.test.ts`);
}
