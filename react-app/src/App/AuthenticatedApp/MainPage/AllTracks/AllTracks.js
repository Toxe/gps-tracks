import React from "react";
import Content from "./Content";
import { useAllTracks } from "./hooks";

export default function AllTracks() {
    const { tracks } = useAllTracks();

    return <Content tracks={tracks} />;
}
