import * as math from "mathjs";
import { useState } from "react";

const seqs = [
  "cagcgtcgccggccttattgggacgttgcaataagcaccgacggcaatcctacactggacgcccggaaataatcataatacgtgttcacccaatcgttgtggatg".toUpperCase(),
  "tcgttcctcggagacgaaagtgggaaagctaaagcactgcagggcatgtaagacccgcgcagttgccgataatcaatctcaccatcggttgtggagagat".toUpperCase(),
];

function GlobalAlignment() {
  const [seq1, setSeq1] = useState(seqs[0]);
  const [seq2, setSeq2] = useState(seqs[1]);
  const [match, setMatch] = useState(1);
  const [mis, setMis] = useState(-1);
  const [gap, setGap] = useState(-1);
  const [result, setResult] = useState(null);

  const handleGlobalAlignment = (e) => {
    const result = globalAlignment(
      seq1,
      seq2,
      parseFloat(match),
      parseFloat(mis),
      parseFloat(gap)
    );
    setResult(result);
  };

  return (
    <div
      style={{
        flex: 1,
        background: "#435",
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
          onChange={(e) => setMatch(e.target.value)}
        />
        <input
          placeholder="mismatch score"
          value={mis}
          onChange={(e) => setMis(e.target.value)}
        />
        <input
          placeholder="gap score"
          value={gap}
          onChange={(e) => setGap(e.target.value)}
        />
      </div>

      <button onClick={handleGlobalAlignment}>Commit Alignment</button>

      {result && (
        <div
          style={{
            overflow: "hidden",
            wordWrap: "break-word",
            fontSize: "0.65rem",
          }}
        >
          <p>Aligned 1 : {result.align1}</p>
          <p>Aligned 2 : {result.align2}</p>
          <p>Score : {result.score}</p>
          <p>
            Match {result.matchTotal}, Mismatch {result.misTotal}, Indel{" "}
            {result.indelTotal}
          </p>
        </div>
      )}
    </div>
  );
}

export default GlobalAlignment;

const globalAlignment = (seq1, seq2, match = 1, mis = -1, gap = -1) => {
  let F = math.zeros([seq1.length + 1, seq2.length + 1]);
  let S = math.zeros([seq1.length, seq2.length]);

  for (let i = 0; i < seq1.length; ++i)
    for (let j = 0; j < seq2.length; ++j)
      if (seq1[i] === seq2[j]) S[i][j] = match;
      else S[i][j] = mis;

  for (let i = 0; i < seq1.length + 1; ++i) F[i][0] = i * gap;
  for (let i = 0; i < seq2.length + 1; ++i) F[0][i] = i * gap;
  for (let i = 1; i < seq1.length + 1; ++i)
    for (let j = 1; j < seq2.length + 1; ++j)
      F[i][j] = Math.max(
        F[i - 1][j - 1] + S[i - 1][j - 1],
        F[i - 1][j] + gap,
        F[i][j - 1] + gap
      );

  let align1 = "";
  let align2 = "";
  for (let i = seq1.length, j = seq2.length; i > 0 && j > 0; ) {
    if (i > 0 && j > 0 && F[i][j] === F[i - 1][j - 1] + S[i - 1][j - 1]) {
      align1 = seq1[i - 1] + align1;
      align2 = seq2[j - 1] + align2;
      --i;
      --j;
    } else if (i > 0 && F[i][j] === F[i - 1][j] + gap) {
      align1 = seq1[i - 1] + align1;
      align2 = "_" + align2;
      --i;
    } else {
      align1 = "_" + align1;
      align2 = seq2[j - 1] + align2;
      --j;
    }
  }

  console.log(align1, align2, F);

  const score = F[seq1.length][seq2.length];

  let matchTotal = 0;
  align1.split("").forEach((curr, i) => {
    if (curr === align2[i]) ++matchTotal;
  });

  let misTotal = 0;
  align1.split("").forEach((curr, i) => {
    if (curr !== align2[i] && curr !== "_" && align2[i] !== "_") ++misTotal;
  });

  let indelTotal = 0;
  align1.split("").forEach((curr, i) => {
    if (curr === "_" || align2[i] === "_") ++indelTotal;
  });

  return { align1, align2, score, matchTotal, misTotal, indelTotal };
};
