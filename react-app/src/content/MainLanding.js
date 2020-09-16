import React from "react";
import { Navigate } from "react-router-dom";

export default function MainLanding() {
    return <Navigate to="/tracks" replace />;
}
