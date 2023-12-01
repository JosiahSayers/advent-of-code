const inputFile = Bun.file('2023/1/input.txt');
const input = await inputFile.text();
const lines = input.split('\n').filter(line => line.length > 0);
const showWork = Bun.env.SHOW_WORK === 'true';

const part1Digits = lines.map(line => line.replaceAll(/\D/g, '').split(''));
const part1Total = countFirstAndLastDigit(part1Digits);

const parsedLines = lines.map(line => {
  const numbers = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9'
  };

  const regex = /\d|one|two|three|four|five|six|seven|eight|nine/;

  const firstDigit = line.match(regex)?.pop();

  let lastDigit = ''
  for (let i=line.length - 1; i > 0; i--) {
    // search string from end until a match is found
    const substring = line.substring(i);
    const foundString = substring.match(regex)?.pop();
    if (foundString) {
      lastDigit = foundString;
      break;
    }
  }
  const results = [firstDigit, lastDigit].filter(digit => !!digit).map(digit => {
    if (digit?.match(/\d/)) {
      return digit;
    }
    return numbers[digit as keyof typeof numbers];
  });

  if (showWork) {
    console.log(`${line} -> ${results}`);
  }

  return results;
});

const part2Total = countFirstAndLastDigit(parsedLines);

console.log(`Part 1 answer: ${part1Total}`);
console.log(`Part 2 answer: ${part2Total}`);

function countFirstAndLastDigit(lines: string[][]) {
  let total = 0;

  lines.forEach(line => {
    const number = parseInt(`${line.at(0)}${line.at(-1)}`);
    if (showWork) {
      console.log(`${total} + ${number} = ${total + number}`);
    }
    total += number;
  });

  return total;
}
