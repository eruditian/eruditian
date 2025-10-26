/** Shuffles the referenced array. Returns the same reference. */
export const shuffleArray = <T>(array: T[]): T[] => {
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

/** Returns [`column`, `row`] position for a given index in a 2D array of given column count. */
export const indexTo2DColumnRow = (
  index: number,
  column_count: number,
): [number, number] => {
  return [index % column_count, index / column_count];
};
/** Returns [`row`, `column`] position for a given index in a 2D array of given column count. */
export const indexTo2DRowColumn = (
  index: number,
  column_count: number,
): [number, number] => {
  return [index / column_count, index % column_count];
};
