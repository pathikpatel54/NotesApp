import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchNotes } from "../features/notes/notesSlice";
import { useSelector } from "react-redux";
import { selectAllNotes } from "../features/notes/notesSlice";
import { fetchAuth, selectAllAuth } from "../features/auth/authSlice";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MantineProvider } from "@mantine/core";
import { HeaderMegaMenu } from "./Header";
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
        <MantineProvider
            theme={{
                colorScheme: "dark",
                // colors: {
                //     // override dark colors to change them for all components
                //     dark: ["#d5d7e0"],
                // },
            }}
            withGlobalStyles
            withNormalizeCSS
        >
            <div className="App">
                <BrowserRouter>
                    <HeaderMegaMenu></HeaderMegaMenu>
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </MantineProvider>
    );
};

export default App;
