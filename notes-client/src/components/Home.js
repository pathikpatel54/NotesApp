import { useState } from "react";
import {
    AppShell,
    Navbar,
    Header,
    Burger,
    useMantineTheme,
    Group,
    createStyles,
    Image,
    Transition,
    Autocomplete,
    ScrollArea,
} from "@mantine/core";
import Head from "./Head";
import Editor from "./Editor";

import Sidebar from "./Sidebar";
import { IconSearch } from "@tabler/icons";
import { getNotesDecrypted } from "../features/notes/notesSlice";
import { useSelector } from "react-redux";

const useStyles = createStyles((theme) => ({
    inner: {
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    section: {
        marginLeft: `calc(${theme.spacing.md} * -1)`,
        marginRight: `calc(${theme.spacing.md} * -1)`,
        marginBottom: theme.spacing.md,

        "&:not(:last-of-type)": {
            borderBottom: `${1} solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[3]
            }`,
        },
    },
}));

export default function AppShellDemo() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(true);
    const [selected, setSelected] = useState(0);
    const { classes } = useStyles();
    const decrypted = useSelector(getNotesDecrypted);

    const onSelectChange = (index) => {
        setSelected(index);
    };

    return (
        <AppShell
            styles={{
                main: {
                    background:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            }}
            navbarOffsetBreakpoint={opened ? "xs" : "5000"}
            asideOffsetBreakpoint="xs"
            navbar={
                <Transition
                    mounted={opened}
                    transition="slide-right"
                    duration={200}
                    timingFunction="ease"
                >
                    {(styles) => (
                        <Navbar
                            p="md"
                            hiddenBreakpoint="5000"
                            hidden={!opened}
                            width={{ sm: 250, lg: 350 }}
                            style={{
                                ...styles,
                            }}
                        >
                            <Navbar.Section>
                                <Autocomplete
                                    placeholder="Search"
                                    icon={
                                        <IconSearch size="1rem" stroke={1.5} />
                                    }
                                    data={[
                                        "React",
                                        "Angular",
                                        "Vue",
                                        "Next.js",
                                        "Riot.js",
                                        "Svelte",
                                        "Blitz.js",
                                    ]}
                                />
                            </Navbar.Section>
                            <Navbar.Section
                                grow
                                mt="md"
                                className={classes.section}
                                component={ScrollArea}
                            >
                                <Sidebar
                                    onSelectChange={onSelectChange}
                                    selected={selected}
                                />
                            </Navbar.Section>
                        </Navbar>
                    )}
                </Transition>
            }
            header={
                <Header height={{ base: 60, md: 60 }} p="md">
                    <div className={classes.inner}>
                        <Group>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                            />

                            <Image src="logo.png" maw={200} />
                        </Group>
                        <Head />
                    </div>
                </Header>
            }
        >
            {decrypted ? <Editor selected={selected} /> : <></>}
        </AppShell>
    );
}
