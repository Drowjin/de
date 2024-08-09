import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  axios.defaults.withCredentials = true;

  const [count, setCount] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("https://de-9lxv.onrender.com", { count });
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSubmitClear = async () => {
    try {
      const res = await axios.get("https://de-9lxv.onrender.com/clear");
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <input
        type="text"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <button onClick={() => handleSubmit()}>press me</button>
      <button onClick={() => handleSubmitClear()}>clear me</button>
    </>
  );
}

export default App;
