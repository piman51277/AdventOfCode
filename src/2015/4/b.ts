import { createHash } from "crypto";
const seed = "bgvyzdsv";
let suffix = 0;
// eslint-disable-next-line no-constant-condition
while (true) {
    const hash = createHash("md5");
    hash.update(`${seed}${suffix}`);
    if (hash.copy().digest('hex').indexOf("000000") == 0) break;
    suffix++;
}
console.log(suffix);