import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Pagination } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    pager: {
        marginBottom: theme.spacing(2),
    },
}));

export default React.memo(function Pager({ showPager, numPages, page, handleChangePage }) {
    const classes = useStyles();

    if (!showPager || numPages === 0 || page < 1) {
        return null;
    }

    return <Pagination count={numPages} page={page} onChange={handleChangePage} className={classes.pager} />;
});
