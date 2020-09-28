import React from "react";
import ReactDOM from "react-dom";
import "fontsource-roboto/300.css";
import "fontsource-roboto/400.css";
import "fontsource-roboto/500.css";
import "fontsource-roboto/700.css";
import "./index.css";
import "./i18n";
import { CssBaseline } from "@material-ui/core";
import { AuthProvider } from "./Auth/AuthProvider";
import App from "./App/App";

ReactDOM.render(
    <React.StrictMode>
        <CssBaseline />
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
