import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAllNotes,
    fetchNotes,
    getNotesKey,
} from "../features/notes/notesSlice";
import { fetchAuth, selectAllAuth } from "../features/auth/authSlice";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
    ActionIcon,
    Button,
    MantineProvider,
    Modal,
    TextInput,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Home from "./Home";
import {
    IconLockAccess,
    IconLockAccessOff,
    IconLockOff,
    IconLockOpen,
} from "@tabler/icons";

const App = () => {
    const dispatch = useDispatch();
    const notes = useSelector(selectAllNotes);
    const auth = useSelector(selectAllAuth);
    const key = useSelector(getNotesKey);
    const [opened, { open, close }] = useDisclosure(true);

    useEffect(() => {
        dispatch(fetchNotes());
        dispatch(fetchAuth());
    }, []);

    return (
        <>
            <MantineProvider
                theme={{
                    colorScheme: "dark",
                    defaultRadius: "xs",
                }}
                withGlobalStyles
                withNormalizeCSS
            >
                <div id="App">
                    <Modal
                        opened={opened}
                        title="Enter your password"
                        size={"sm"}
                        withCloseButton={false}
                    >
                        <TextInput
                            placeholder="Password"
                            onChange={() => console.log("Submitted")}
                        />
                        <Button
                            fullWidth
                            mt={"md"}
                            leftIcon={<IconLockOpen size="1rem" />}
                        >
                            Unlock Notes
                        </Button>
                    </Modal>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home />} />
                        </Routes>
                    </BrowserRouter>
                </div>
            </MantineProvider>
        </>
    );
};

export default App;
