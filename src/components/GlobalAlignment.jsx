import * as math from "mathjs";
import { useState } from "react";

function GlobalAlignment() {
  const [seq1, setSeq1] = useState(
    "cagcgtcgccggccttattgggacgttgcaataagcaccgacggcaatcctacactggacgcccggaaataatcataatacgtgttcacccaatcgttgtggatg"
  );
  const [seq2, setSeq2] = useState(
    "tcgttcctcggagacgaaagtgggaaagctaaagcactgcagggcatgtaagacccgcgcagttgccgataatcaatctcaccatcggttgtggagagat"
  );
  const [match, setMatch] = useState(1);
  const [mis, setMis] = useState(-1);
  const [gap, setGap] = useState(-1);
  const [result, setResult] = useState(null);

  const handleGlobalAlignment = (e) => {
    const result = globalAlignment(seq1, seq2, match, mis, gap);
    setResult(result);
  };

  return (
    <div
      style={{
        width: "50%",
        height: "100vh",
        background: "#542",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: 18,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <h1>Global Alignment</h1>

      <input
        placeholder="dna sequence 1"
        value={seq1}
        onChange={(e) => setSeq1(e.target.value)}
      />
      <input
        placeholder="dna sequence 2"
        value={seq2}
        onChange={(e) => setSeq2(e.target.value)}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          placeholder="match score"
          value={match}
          onChange={(e) => setMatch(parseFloat(e.target.value))}
        />
        <input
          placeholder="mismatch score"
          value={mis}
          onChange={(e) => setMis(parseFloat(e.target.value))}
        />
        <input
          placeholder="gap score"
          value={gap}
          onChange={(e) => setGap(parseFloat(e.target.value))}
        />
      </div>

      <button onClick={handleGlobalAlignment}>Commit Alignment</button>

      {result && (
        <div style={{ overflow: "hidden", wordWrap: "break-word" }}>
          <p>Aligned 1 : {result.align1}</p>
          <p>Aligned 2 : {result.align2}</p>
        </div>
      )}
    </div>
  );
}

export default GlobalAlignment;

const globalAlignment = (seq1, seq2, match = 1, mis = -1, gap = -1) => {
  let data = math.zeros([seq1.length + 1, seq2.length + 1]);
  let matchData = math.zeros([seq1.length, seq2.length]);

  for (let i = 0; i < seq1.length; ++i)
    for (let j = 0; j < seq2.length; ++j)
      if (seq1[i] === seq2[j]) matchData[i][j] = match;
      else matchData[i][j] = mis;

  for (let i = 0; i < seq1.length + 1; ++i) data[i][0] = i * gap;
  for (let i = 0; i < seq2.length; ++i) data[0][i] = i * gap;

  for (let i = 1; i < seq1.length + 1; ++i)
    for (let j = 1; j < seq2.length + 1; ++j)
      data[i][j] = Math.max(
        data[i - 1][j] + gap,
        data[i][j - 1] + gap,
        data[i - 1][j - 1] + matchData[i - 1][j - 1]
      );

  let align1 = "";
  let align2 = "";

  for (let li = seq1.length, lj = seq2.length; li > 0 && lj > 0; ) {
    if (
      li > 0 &&
      lj > 0 &&
      data[li][lj] === data[li - 1][lj - 1] + matchData[li - 1][lj - 1]
    ) {
      align1 = seq1[li - 1] + align1;
      align2 = seq2[lj - 1] + align2;
      --li;
      --lj;
    } else if (li > 0 && data[li][lj] === data[li - 1][lj] + gap) {
      align1 = seq1[li - 1] + align1;
      align2 = "_" + align2;
      --li;
    } else {
      align1 = "_" + align1;
      align2 = seq2[lj - 1] + align2;
      --lj;
    }
  }

  console.log(align1, align2);

  return { align1, align2 };
};
