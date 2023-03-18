import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAllNotes,
    fetchNotes,
    getNotesKey,
    setDecryptionKey,
    getNotesDecrypted,
} from "../features/notes/notesSlice";
import { fetchAuth, selectAllAuth } from "../features/auth/authSlice";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
    Button,
    MantineProvider,
    Modal,
    TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Home from "./Home";
import {
    IconLockOpen,
} from "@tabler/icons";

const App = () => {
    const dispatch = useDispatch();
    const notes = useSelector(selectAllNotes);
    const key = useSelector(getNotesKey);
    const [opened, { open, close }] = useDisclosure(false);
    const decrypted = useSelector(getNotesDecrypted);

    useEffect(() => {
        dispatch(fetchNotes(key));
        dispatch(fetchAuth());
        if (key === "") {
            open();
        }
    }, []);

    useEffect(() => {
        if (decrypted === false) {
            open();
        }
    }, [key]);

    const onPasswordSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchNotes(key));
        close();
    };

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
                        centered
                    >
                        <TextInput
                            placeholder="Password"
                            value={key}
                            onChange={(e) =>
                                dispatch(setDecryptionKey(e.target.value))
                            }
                        />
                        <Button
                            fullWidth
                            mt={"md"}
                            leftIcon={<IconLockOpen size="1rem" />}
                            onClick={onPasswordSubmit}
                            type="submit"
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
