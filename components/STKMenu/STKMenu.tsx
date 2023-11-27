import {IconButton} from "@mui/material";
import Menu from '@mui/material/Menu';
import { useState, MouseEvent } from "react"
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {ThemeProvider} from "@mui/material";
import theme from "@/components/theme";

const ITEM_HEIGHT = 48;

interface STKMenuProps {
    options: Array<object>
    optionLabel?: string
    onChange?: (selectedOption: Object) => void
}


export default function STKMenu({
    options = [],
    optionLabel = "label",
    onChange = () => ({})
}: STKMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        setAnchorEl(e.currentTarget);
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
                            width: '20ch',
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
