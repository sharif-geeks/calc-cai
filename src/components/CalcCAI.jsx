import { useState } from "react";

const dnas = [
  "atgcagccgagaagtgtaattatgtcatttttccaaaca",
  "atggccttccagcagctgtcgggggtcaacgccgtcatgttc",
];

const defaultUsageTable = `ATT I 0.32 ACT T 0.24 AAT N 0.39 AGT S 0.14
ATC I 0.56 ACC T 0.40 AAC N 0.61 AGC S 0.24
ATA I 0.12 ACA T 0.25 AAA K 0.38 AGA R 0.18
ATG M 1.00 ACG T 0.11 AAG K 0.62 AGG R 0.20
CTT L 0.12 CCT P 0.30 CAT H 0.35 CGT R 0.10
CTC L 0.21 CCC P 0.33 CAC H 0.65 CGC R 0.21
CTA L 0.07 CCA P 0.26 CAA Q 0.24 CGA R 0.13
CTG L 0.42 CCG P 0.11 CAG Q 0.76 CGG R 0.18
GTT V 0.16 GCT A 0.30 GAT D 0.42 GGT G 0.18
GTC V 0.27 GCC A 0.41 GAC D 0.58 GGC G 0.35
GTA V 0.10 GCA A 0.20 GAA E 0.39 GGA G 0.24
GTG V 0.47 GCG A 0.10 GAG E 0.61 GGG G 0.22
TTT F 0.42 TCT S 0.20 TAT Y 0.39 TGT C 0.43
TTC F 0.58 TCC S 0.25 TAC Y 0.61 TGC C 0.57
TTA L 0.05 TCA S 0.12 TAA * 0.34 TGA * 0.47
TTG L 0.13 TCG S 0.06 TAG * 0.19 TGG W 1.00`;

function CalcCAI() {
  const [dna, setDna] = useState(dnas[0]);
  const [usageTable, setUsageTable] = useState(defaultUsageTable);
  const [result, setResult] = useState(null);

  const handleCalcCAI = () => {
    const result = calcCAI(dna, usageTable);
    setResult(result);
  };

  return (
    <div>
      <textarea
        placeholder="codon usage table"
        value={usageTable}
        onChange={(e) => setUsageTable(e.target.value)}
      />
      <input
        placeholder="dna sequence"
        value={dna}
        onChange={(e) => setDna(e.target.value)}
      />
      <button onClick={handleCalcCAI}>calculate</button>
      {result && (
        <div>
          <p>CAI : {result.CAI}</p>
          <p>log odds : {result.logOdds}</p>
        </div>
      )}
    </div>
  );
}

export default CalcCAI;

const calcCAI = (dna, usageTable) => {
  const seq = String(dna).toUpperCase();

  console.log(seq);

  const listRaw = usageTable.replaceAll("\n", " ").split(" ");
  const listInit = Array.from({ length: listRaw.length / 3 }).map((_, i) => {
    return [listRaw[i * 3], listRaw[i * 3 + 1], parseFloat(listRaw[i * 3 + 2])];
  });

  console.log("listInit", listInit);

  let qkSelector = {};
  listInit.forEach((item, i) => {
    if (qkSelector[item[1]] !== undefined) qkSelector[item[1]].push(item[2]);
    else qkSelector[item[1]] = [item[2]];
  });
  Object.keys(qkSelector).forEach((key) => {
    const max = Math.max(...qkSelector[key]);
    qkSelector[key] = max;
  });

  const list = listInit.map((item) => [...item, qkSelector[item[1]]]);

  console.log("list", list);

  const protList = []; // [protein,pk,qk]
  Array.from({ length: seq.length / 3 }).forEach((_, i) => {
    const codon = seq[i * 3] + seq[i * 3 + 1] + seq[i * 3 + 2];
    const item = list.find((item) => item[0] === codon);
    protList.push([item[1], item[2], item[3]]);
    if (codon !== "TAA" || codon !== "TAG" || codon !== "TGA")
      console.log(`${codon} ${protList[protList.length - 1].join(" ")}`);
  });

  let CAI = 1;
  protList.forEach((item) => {
    CAI *= item[1] / item[2];
  });
  CAI = Math.pow(CAI, 1 / protList.length);

  console.log("CAI: ", CAI);

  let logOdds = 0;
  protList.forEach((item) => {
    logOdds += Math.log(item[1] / item[2]);
  });
  logOdds /= protList.length;

  console.log("Log Odds: ", logOdds);

  return { CAI, logOdds, protList };
};
