const sampleString = "garbage--add(2,3)!udiuahsidhasui";

const regex = /add\((\d+),(\d+)\)/;
const match = regex.exec(sampleString);

if (match) {
  const [full, g0, g1] = match;
  console.log(full); // add(2,3)
  console.log(g0); // 2
  console.log(g1); // 3
}
