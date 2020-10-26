import React from "react";
import { Box } from "@material-ui/core";
import FilterActivity from "./FilterActivity";
import FilterYear from "./FilterYear";

export default function Filter({
    activityFilter,
    yearFilter,
    availableActivities,
    availableYears,
    handleChangeFilter,
}) {
    return (
        <Box>
            <FilterActivity
                activityFilter={activityFilter}
                availableActivities={availableActivities}
                handleChangeFilter={handleChangeFilter}
            />
            <FilterYear
                yearFilter={yearFilter}
                availableYears={availableYears}
                handleChangeFilter={handleChangeFilter}
            />
        </Box>
    );
}
