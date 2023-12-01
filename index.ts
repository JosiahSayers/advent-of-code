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

if (await Bun.file(`2023/${day}`).exists()) {
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
  const requiredFiles = [
    'input.txt',
    'problem.md',
    'solution.ts',
  ];
  
  await mkdir(`2023/${day}`, { recursive: true });

  for (const requiredFile of requiredFiles) {
    const file = Bun.file(`2023/${day}/${requiredFile}`);
    await Bun.write(file, '');
    console.log(`Created file: 2023/${day}/${requiredFile}`);
  }
}
