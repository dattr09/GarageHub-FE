import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/ping`)
      .then((res) => setMsg(res.data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>FE - BE Connection Test</h1>
      <p>Response: {msg}</p>
    </div>
  );
}

export default App;
