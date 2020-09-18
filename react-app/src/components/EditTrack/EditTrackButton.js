import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) => ({
    button: {
        marginLeft: theme.spacing(2),
    },
}));

export default function EditTrackButton() {
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("edit");
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                className={classes.button}
                onClick={handleClick}>
                {t("button_edit_track")}
            </Button>
        </div>
    );
}
