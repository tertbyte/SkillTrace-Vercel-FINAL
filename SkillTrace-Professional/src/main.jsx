import React from "react";
import {createRoot} from "react-dom/client";
import App from "./App";
import SecurityGate from "./SecurityGate";
import "./styles.css";
createRoot(document.getElementById("root")).render(<React.StrictMode><SecurityGate><App/></SecurityGate></React.StrictMode>);
