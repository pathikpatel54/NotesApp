import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";
import { Textarea } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { selectAllNotes, syncNote } from "../features/notes/notesSlice";
import { sendMessage, socket, waitForOpenSocket } from "../middlewares/socket";
import { useEffect, useState } from "react";
let flag = false;

const Editor = ({ selected }) => {
    const notes = useSelector(selectAllNotes);
    const [webSocket, setWebSocket] = useState(null);
    const [note, setNote] = useState(notes[selected]);
    const dispatch = useDispatch();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Image,
        ],
        content: note?.content,
        onUpdate({ editor }) {
            setNote((prevState) => ({
                ...prevState,
                content: editor.getHTML(),
            }));
        },
    });

    useEffect(() => {
        if (flag === false && editor != null) {
            const content = notes[selected]?.content;
            editor?.commands?.setContent(content);
            setNote(notes[selected]);
            flag = true;
        }
        setNote(notes[selected]);
    }, [notes]);

    useEffect(() => {
        dispatch(syncNote({ selected, content: note }));
        const message = {
            type: "modify",
            new: note,
        };
        sendMessage(webSocket, JSON.stringify(message));
    }, [note?.content, note?.title]);

    useEffect(() => {
        setWebSocket(socket());
    }, []);

    useEffect(() => {
        const content = notes[selected]?.content;
        editor?.commands?.setContent(content);
        setNote(notes[selected]);
    }, [selected, editor]);

    return (
        <>
            <RichTextEditor editor={editor} mr={"md"} className="rte">
                <RichTextEditor.Toolbar>
                    <Textarea
                        placeholder="Untitled Note"
                        variant={"unstyled"}
                        w={"100%"}
                        size={"lg"}
                        maxRows={1}
                        mah={"48px"}
                        value={note ? note.title : ""}
                        onChange={(event) => {
                            setNote((prev) => ({
                                ...prev,
                                title: event.target.value,
                            }));
                        }}
                    />
                </RichTextEditor.Toolbar>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content className="rte-content" />
            </RichTextEditor>
        </>
    );
};

export default Editor;
