import "./App.css";
import CalcCAI from "./components/CalcCAI";
import GlobalAlignment from "./components/GlobalAlignment";

function App() {
  return (
    <div className="App">
      <CalcCAI />
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "50%",
        }}
      >
        <GlobalAlignment />
        <div style={{ backgroundColor: "#345", padding: 18, height: "50%" }}>
          <iframe
            src="https://codesandbox.io/embed/github/sharif-geeks/calc-cai/tree/main?fontsize=14&hidenavigation=1&theme=dark&view=editor&module=/src/components/CalcCAI.jsx,/src/components/GlobalAlignment.jsx"
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              borderRadius: 4,
              overflow: "hidden",
            }}
            title="cai-calc"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
