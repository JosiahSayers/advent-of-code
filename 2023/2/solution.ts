const showWork = Bun.env.SHOW_WORK === 'true';
const file = Bun.file('2023/2/input.txt');
const input = await file.text();
const config = {
  red: 12,
  green: 13,
  blue: 14,
};
const part1Answer = part1(input, config);
const part2Answer = part2(input, config);
console.log(`Part 1: ${part1Answer}`);
console.log(`Part 2: ${part2Answer}`);

interface RGB {
  red: number;
  green: number;
  blue: number;
}

interface Game {
  title: string;
  rounds: RGB[];
}

export function part1(input: string, config: RGB): number {
  const games = getGames(input);
  const validGames = games.filter(findValidGames(config));
  return sumGameNumbers(validGames);
}

export function part2(input: string, config: RGB): number {
  const games = getGames(input);
  const gameMaxes = getGameMaxes(games);
  const roundPowers = getRoundPowers(gameMaxes);
  return sumRoundPowers(roundPowers);
}


// Shared

function getGames(input: string) {
  const gameStrings = input.split('\n');
  const games = gameStrings.map<Game>(gameString => {
    const title = gameString.split(':')[0].trim();
    const rounds = gameString.substring(gameString.indexOf(':') + 1).trim().split(';');
    const mappedRounds = rounds.map(mapRound);
    return { title, rounds: mappedRounds };
  });
  return games.filter(game => game.title);
}

function mapRound(round: string) {
  const regex = /(?<count>\d+)\s*(?<color>\w*)/g;
  const dice = round.split(/,\s*/);
  const output = { red: 0, green: 0, blue: 0 };
  dice.forEach(die => {
    const groups = regex.exec(round)?.groups;
    if (groups?.count && groups.color) {
      const color = groups.color.toLowerCase() as 'red' | 'green' | 'blue';
      output[color] = parseInt(groups.count);
    }
  });
  return output;
}


// Part 1

function findValidGames(config: RGB) {
  return (game: Game) => (
    game.rounds.every(round => 
      round.red <= config.red
      && round.green <= config.green
      && round.blue <= config.blue
    )
  )
}

function sumGameNumbers(games: Game[]): number {
  const titleNumbers = games.map(game => parseInt(/\d+/.exec(game.title)?.[0] ?? '0'));
  return titleNumbers.reduce((acc, num) => acc + num, 0);
}


// Part 2

function getGameMaxes(games: Game[]): RGB[] {
  return games.map(game => {
    const reds = game.rounds.map(round => round.red);
    const greens = game.rounds.map(round => round.green);
    const blues = game.rounds.map(round => round.blue);
    const maxes = {
      red: reds.sort((a, b) => a - b).pop()!,
      green: greens.sort((a, b) => a - b).pop()!,
      blue: blues.sort((a, b) => a - b).pop()!
    };
    if (showWork) {
      console.log(`${game.title}: ${JSON.stringify(maxes)}`);
    }
    return maxes;
  });
}

function getRoundPowers(maxes: RGB[]): number[] {
  return maxes.map(max => {
    const roundPower = max.red * max.green * max.blue;
    if (showWork) {
      console.log(roundPower);
    }
    return roundPower;
  });
}

function sumRoundPowers(powers: number[]): number {
  return powers.reduce((acc, power) => acc + power, 0);
}
