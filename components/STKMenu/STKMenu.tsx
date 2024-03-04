import {IconButton} from "@mui/material";
import Menu from '@mui/material/Menu';
import { useState, MouseEvent } from "react"
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {ThemeProvider} from "@mui/material";
import theme from "@/components/theme";
import STKButton from "@/components/STKButton/STKButton";

const ITEM_HEIGHT = 48;

interface STKMenuProps {
    options: Array<object>
    optionLabel?: string
    width?: string
    customTarget?: string
    onChange?: (selectedOption: Object) => void
    onClick?: () => void
}


export default function STKMenu({
    options = [],
    optionLabel = "label",
    width,
    customTarget,
    onChange = () => ({}),
    onClick = () => ({})
}: STKMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        setAnchorEl(e.currentTarget);
        onClick()
    };
    const handleClose = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        setAnchorEl(null);
    };

    const handleOptionOnClick = (e: MouseEvent<HTMLElement>, selectedOption: Object) => {
        e.stopPropagation()
        onChange(selectedOption)
        setAnchorEl(null)
    }

    return (
        <ThemeProvider theme={theme}>
            <div>
                {customTarget ? (
                    <STKButton onClick={handleClick} iconButton>
                        <label className="font-semibold text-neutral-800 text-sm">{customTarget}</label>
                    </STKButton>
                ) : (
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                )}

                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: width || '20ch',
                        },
                    }}
                >
                    {options.map((option, index) => (
                        <MenuItem key={index} onClick={(e) => handleOptionOnClick(e, option)}>
                            {
                                // @ts-ignore
                                option[optionLabel]
                            }
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        </ThemeProvider>
    )
}
