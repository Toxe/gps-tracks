import React from "react";
import { Box } from "@material-ui/core";
import FilterActivity from "./FilterActivity";
import FilterYear from "./FilterYear";

export default React.memo(function Filter({
    activityFilter,
    yearFilter,
    availableActivities,
    availableYears,
    handleChangeActivityFilter,
    handleChangeYearFilter,
}) {
    return (
        <Box>
            <FilterActivity
                activityFilter={activityFilter}
                availableActivities={availableActivities}
                handleChangeActivityFilter={handleChangeActivityFilter}
            />
            <FilterYear
                yearFilter={yearFilter}
                availableYears={availableYears}
                handleChangeYearFilter={handleChangeYearFilter}
            />
        </Box>
    );
});
