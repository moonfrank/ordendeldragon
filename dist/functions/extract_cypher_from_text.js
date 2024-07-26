import fs from "node:fs";

export function extract_cypher_from_text() {
  let data = fs.readFileSync("./dist/data/cipher.txt", {encoding: "utf8"});
  const lines = data.split("\r\n");
  let code = {};
  for (let line of lines) {
    const [number, symbol] = [line.split('\t')[0], line.split('\t')[1]];
    code[number] = symbol;
  }
  fs.writeFileSync("./dist/data/cipher.json", JSON.stringify(code));
}
