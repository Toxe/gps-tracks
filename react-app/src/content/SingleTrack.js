import React from "react";
import { useParams } from "react-router-dom";
import ExampleTrack from "./ExampleTrack";

export default function SingleTrack() {
    const { trackId } = useParams();

    return <ExampleTrack id={trackId} activity="bike" />;
}
