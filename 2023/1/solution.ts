const inputFile = Bun.file('2023/1/input.txt');
const input = await inputFile.text();
const lines = input.split('\n').filter(line => line.length > 0);
const showWork = Bun.env.SHOW_WORK === 'true';

const part1Total = countFirstAndLastDigit(lines);

const parsedLines = lines.map(line => {
  const numbers = {
    one: 'one1one',
    two: 'two2two',
    three: 'three3three',
    four: 'four4four',
    five: 'five5five',
    six: 'six6six',
    seven: 'seven7seven',
    eight: 'eight8eight',
    nine: 'nine9nine'
  };

  let parsedLine = line;
  (Object.keys(numbers) as Array<keyof typeof numbers>).forEach(number => {
    parsedLine = parsedLine.replaceAll(number, numbers[number].toString());
  });

  if (showWork) {
    console.log(`${line} -> ${parsedLine}`);
  }

  return parsedLine;
});

const part2Total = countFirstAndLastDigit(parsedLines);

console.log(`Part 1 answer: ${part1Total}`);
console.log(`Part 2 answer: ${part2Total}`);

function countFirstAndLastDigit(lines: string[]) {
  let total = 0;

  lines.forEach(line => {
    const digits = line.replaceAll(/\D/g, '');
    const number = parseInt(`${digits.at(0)}${digits.at(-1)}`);
    if (showWork) {
      console.log(`${total} + ${number} = ${total + number}`);
    }
    total += number;
  });

  return total;
}
