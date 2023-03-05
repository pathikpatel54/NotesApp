import {
    ActionIcon,
    Autocomplete,
    createStyles,
    Divider,
    getStylesRef,
    Group,
    Navbar,
    Text,
    Tooltip,
} from "@mantine/core";
import {
    Icon2fa,
    IconBellRinging,
    IconDatabaseImport,
    IconFingerprint,
    IconKey,
    IconPlus,
    IconReceipt2,
    IconSearch,
    IconSettings,
} from "@tabler/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectAllNotes } from "../features/notes/notesSlice";

const useStyles = createStyles((theme) => ({
    link: {
        ...theme.fn.focusStyles(),
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        fontSize: theme.fontSizes.sm,
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[1]
                : theme.colors.gray[7],
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        borderRadius: theme.radius.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
            color: theme.colorScheme === "dark" ? theme.white : theme.black,

            [`& .${getStylesRef("icon")}`]: {
                color: theme.colorScheme === "dark" ? theme.white : theme.black,
            },
        },
    },

    linkIcon: {
        ref: getStylesRef("icon"),
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.gray[6],
        marginRight: theme.spacing.sm,
    },

    linkActive: {
        "&, &:hover": {
            backgroundColor: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).background,
            color: theme.fn.variant({
                variant: "light",
                color: theme.primaryColor,
            }).color,
            [`& .${getStylesRef("icon")}`]: {
                color: theme.fn.variant({
                    variant: "light",
                    color: theme.primaryColor,
                }).color,
            },
        },
    },

    collectionsHeader: {
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        marginBottom: 5,
    },
}));

const data = [
    { link: "", label: "Notifications", icon: IconBellRinging },
    { link: "", label: "Billing", icon: IconReceipt2 },
    { link: "", label: "Security", icon: IconFingerprint },
    { link: "", label: "SSH Keys", icon: IconKey },
    { link: "", label: "Databases", icon: IconDatabaseImport },
    { link: "", label: "Authentication", icon: Icon2fa },
    { link: "", label: "Other Settings", icon: IconSettings },
];

const Sidebar = () => {
    const { classes, cx } = useStyles();
    const [active, setActive] = useState(0);
    const notes = useSelector(selectAllNotes);

    const links = notes.map((note, index) => (
        <a
            className={cx(classes.link, {
                [classes.linkActive]: index === active,
            })}
            href="#"
            key={note.id}
            onClick={(event) => {
                event.preventDefault();
                setActive(index);
            }}
        >
            <span>{note.title=="" ? "Untitled Note": note.title}</span>
        </a>
    ));

    return (
        <>
            <Group className={classes.collectionsHeader} position="apart">
                <Text size="md" weight={500} color="dimmed">
                    Notes
                </Text>

                <Tooltip label="Create new note" withArrow position="right">
                    <ActionIcon variant="default" size={23}>
                        <IconPlus size="0.8rem" stroke={1.5} />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <Divider my="xs" variant="solid" />
            <div className={classes.collections}>{links}</div>
        </>
    );
};

export default Sidebar;
