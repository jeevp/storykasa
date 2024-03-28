import React, {useState, MouseEvent, useEffect} from 'react';
// @ts-ignore
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
// @ts-ignore
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, DraftInlineStyleType, ContentBlock } from 'draft-js';
import { InputAdornment, TextField, ThemeProvider, Button } from "@mui/material";
import { beige300, neutral600, neutral800 } from "@/assets/colorPallet/colors";
import theme from "@/components/theme";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import "./style.scss"


interface StyleButtonProps {
    onToggle: (style: string) => void;
    style: string;
    active: boolean;
    children: React.ReactNode;
}

const StyleButton = ({ onToggle, style, active, children }: StyleButtonProps) => {
    const onMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onToggle(style);
    };

    const buttonStyle = {
        marginRight: '2px',
        borderColor: active ? neutral800 : neutral600,
        color: active ? neutral800 : neutral600
    };

    return (
        <Button onMouseDown={onMouseDown} style={buttonStyle} variant="outlined">
            {children}
        </Button>
    );
};

interface ToolbarProps {
    editorState: EditorState;
    onToggle: (style: string) => void;
}

const Toolbar = ({ editorState, onToggle }: ToolbarProps) => {
    const currentStyle = editorState.getCurrentInlineStyle();

    const isStyleActive = (style: DraftInlineStyleType | 'ordered-list' | 'unordered-list' | 'blockquote') => {
        const selection = editorState.getSelection();
        const startKey = selection.getStartKey();
        const currentContent = editorState.getCurrentContent();
        const currentBlock: ContentBlock = currentContent.getBlockForKey(startKey);
        const blockType = currentBlock.getType();

        if (style === 'BOLD' || style === 'ITALIC' || style === 'UNDERLINE') {
            return currentStyle.has(style);
        } else {
            const draftStyleMap: { [key: string]: string } = {
                'ordered-list': 'ordered-list-item',
                'unordered-list': 'unordered-list-item',
                'blockquote': 'blockquote',
            };
            return blockType === draftStyleMap[style];
        }
    };

    return (
        <div className="flex items-center overflow-x-auto hide-scrollbar">
            <StyleButton onToggle={onToggle} style="BOLD" active={isStyleActive('BOLD')}>
                <FormatBoldIcon />
            </StyleButton>
            <StyleButton onToggle={onToggle} style="ITALIC" active={isStyleActive('ITALIC')}>
                <FormatItalicIcon />
            </StyleButton>
            <StyleButton onToggle={onToggle} style="UNDERLINE" active={isStyleActive('UNDERLINE')}>
                <FormatUnderlinedIcon />
            </StyleButton>
            <StyleButton onToggle={onToggle} style="ordered-list" active={isStyleActive('ordered-list')}>
                <FormatListNumberedIcon />
            </StyleButton>
            <StyleButton onToggle={onToggle} style="unordered-list" active={isStyleActive('unordered-list')}>
                <FormatListBulletedIcon />
            </StyleButton>
            <StyleButton onToggle={onToggle} style="blockquote" active={isStyleActive('blockquote')}>
                <FormatQuoteIcon />
            </StyleButton>
        </div>
    );
};

interface STKTextFieldProps {
    onChange: (value: string) => void;
    multiline?: boolean;
    minRows?: number;
    maxRows?: number;
    fluid?: boolean;
    placeholder?: string;
    error?: boolean;
    color?: string;
    type?: string;
    value?: string;
    startAdornment?: any;
    helperText?: string;
    enableRichText?: boolean;
}

function STKTextField({
  fluid = false,
  multiline = false,
  minRows = 5,
  maxRows = 10,
  value,
  startAdornment,
  placeholder,
  error,
  color,
  helperText,
  type,
  onChange = () => ({}),
  enableRichText = false
}: STKTextFieldProps) {

    const createEditorStateFromText = (markdownText: any) => {
        const rawData = markdownToDraft(markdownText, {
            preserveNewlines: true
        });

        const contentState = convertFromRaw(rawData);
        return EditorState.createWithContent(contentState);
    };

    const [editorState, setEditorState] = useState(
        enableRichText ? createEditorStateFromText(value || '') : EditorState.createEmpty()
    );

    useEffect(() => {
        const currentContentAsMarkdown = draftToMarkdown(convertToRaw(editorState.getCurrentContent()));
        // @ts-ignore
        if (enableRichText && value?.length >= 0 && value !== currentContentAsMarkdown) {
            setEditorState(createEditorStateFromText(value));
        }
    }, [value, enableRichText, editorState]);

    const handleEditorChange = (state: any) => {
        setEditorState(state);
        const content = state.getCurrentContent();
        const rawObject = convertToRaw(content);
        const markdownString = draftToMarkdown(rawObject);
        onChange(markdownString);
    };

    const toggleInlineStyle = (inlineStyle: any) => {
        handleEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    }

    const toggleBlockType = (blockType: any) => {
        handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
    }

    const onToggle = (style: any) => {
        switch (style) {
            case 'ordered-list':
                toggleBlockType('ordered-list-item');
                break;
            case 'unordered-list':
                toggleBlockType('unordered-list-item');
                break;
            case 'blockquote':
                toggleBlockType('blockquote');
                break;
            default:
                toggleInlineStyle(style);
                break;
        }
    }

    if (enableRichText) {
        return (
            <ThemeProvider theme={theme}>
                <Toolbar editorState={editorState} onToggle={onToggle} />
                <div
                    className="mt-2 overflow-auto p-4 stk-text-field--rich-editor"
                    style={{ backgroundColor: beige300}}>
                    <Editor
                        editorState={editorState}
                        onChange={handleEditorChange} />
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <TextField
                sx={{ width: fluid ? '100%' : '300px', backgroundColor: beige300 }}
                multiline={multiline}
                minRows={minRows}
                value={value}
                placeholder={placeholder}
                inputProps={{ type }}
                helperText={helperText}
                // @ts-ignore
                color={color}
                error={error}
                maxRows={maxRows}
                InputProps={startAdornment ? ({
                    startAdornment: (
                        <InputAdornment position="start">
                            {startAdornment}
                        </InputAdornment>
                    )
                }) : <></>}
                onChange={(e) => onChange(e.target.value)} />
        </ThemeProvider>
    );
}

export default STKTextField;
