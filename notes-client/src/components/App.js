import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchNotes } from "../features/notes/notesSlice";
import { useSelector } from "react-redux";
import { selectAllNotes } from "../features/notes/notesSlice";
import { fetchAuth, selectAllAuth } from "../features/auth/authSlice";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import Home from "./Home";

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchNotes());
        dispatch(fetchAuth());
    }, []);

    const notes = useSelector(selectAllNotes);
    const auth = useSelector(selectAllAuth);

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
