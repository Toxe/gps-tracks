import React from "react";
import { FormControlLabel, Radio } from "@material-ui/core";
import ActivityRadioLabel from "./ActivityRadioLabel";

export default function ActivityRadio({ activity }) {
    return <FormControlLabel value={activity} control={<Radio />} label={<ActivityRadioLabel activity={activity} />} />;
}
