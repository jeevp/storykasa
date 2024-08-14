import { MenuItem, Select, ThemeProvider, IconButton, InputAdornment } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import theme from "@/components/theme";
import { useEffect, useState } from "react";
import STkCheckbox from "@/components/STKCheckbox/STKCheckbox";
import { green800 } from "@/assets/colorPallet/colors";

interface STKSelectProps {
    options: Array<Object>;
    optionValue?: string;
    optionLabel?: string;
    placeholder?: string;
    multiple?: boolean;
    createCollection?: boolean;
    color?: string;
    enableSelectAll?: boolean;
    selectAllLabel?: string;
    value?: object;
    id?: string;
    fluid?: boolean;
    clearable?: boolean;
    onChange: (selectedOption: any) => void;
    onClear?: () => void;
}

function STKSelect({
   options = [],
   fluid,
   value,
   multiple,
   createCollection,
   enableSelectAll,
   color,
   selectAllLabel = "All",
   placeholder,
   optionValue = "value",
   optionLabel = "label",
   id,
   clearable = false,
   onChange = (selectedOption: any) => ({}),
   onClear = () => ({})
}: STKSelectProps) {
    const [optionsHash, setOptionsHash] = useState({});
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

    useEffect(() => {
        setOptionsHash(
            options.reduce((acc, item) => {
                // @ts-ignore
                acc[item[optionValue]] = item[optionLabel];

                return acc;
            }, {})
        );
    }, [options]);

    useEffect(() => {
        if (multiple && Array.isArray(value)) {
            const options = value.map((val) => val[optionValue]);
            if (value.includes("")) options.push("");
            // @ts-ignore
            setSelectedOptions(options);
        } else if (!multiple && value) {
            // @ts-ignore
            setSelectedOptions([value[optionValue]]);
        } else {
            setSelectedOptions([]);
        }
    }, [value, multiple, optionValue]);

    const handleChange = (e: any) => {
        e.stopPropagation();
        const { value } = e.target;
        if (value === null) return;

        if (value === "Create Collection") {
            onChange?.(value as string);
            return;
        }

        if (multiple) {
            if (value.includes("")) {
                // @ts-ignore
                const _options = [...options.map((option) => option[optionValue]), ""];
                setSelectedOptions(_options);
                onChange(_options.filter((_option) => _option !== ""));
            } else {
                setSelectedOptions(value);
                onChange(value);
            }
        } else {
            // @ts-ignore
            const _selectedOption = options.find((option) => value === option[optionValue]);
            onChange(_selectedOption);
        }
    };

    const handleClearSelection = () => {
        setSelectedOptions([]);
        onChange(multiple ? [] : null);
        onClear();
    };

    const getRenderInputValue = (value: any) => {
        // @ts-ignore
        if (!multiple) return value ? optionsHash[value] : "";

        if (value.includes("")) {
            return "All ages";
        }

        // @ts-ignore
        return value.map((_value: any) => optionsHash[_value]).join(", ");
    };

    const handleAllOnClick = () => {
        setSelectedOptions(!selectedOptions.includes("") ? [""] : []);
        // @ts-ignore
        onChange(!selectedOptions.includes("") ? options.map((opt) => opt[optionValue]) : []);
    };

    return (
        <ThemeProvider theme={theme}>
            <Select
                id={id}
                multiple={multiple}
                displayEmpty
                // @ts-ignore
                color={color}
                renderValue={(selected) => {
                    if (selected?.length === 0 || !value) {
                        return <label className="text-neutral-400">{placeholder}</label>;
                    }
                    return getRenderInputValue(selected);
                }}
                value={multiple ? selectedOptions : selectedOptions[0] || ""}
                sx={{ width: fluid ? "100%" : "300px", backgroundColor: "white" }}
                onChange={handleChange}
                endAdornment={
                    clearable && (selectedOptions.length > 0 || value) ? (
                        <InputAdornment position="end" className="mr-4">
                            <IconButton onClick={handleClearSelection}>
                                <ClearIcon sx={{ width: "18px", height: "18px" }} />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }
            >
                {createCollection && (
                    <MenuItem key={1000} value={"Create Collection"} sx={{ color: green800 }}>
                        Create Collection
                    </MenuItem>
                )}
                {enableSelectAll ? (
                    <MenuItem value={""} onClick={handleAllOnClick}>
                        <STkCheckbox checked={selectedOptions.includes("")} />
                        <label>{selectAllLabel}</label>
                    </MenuItem>
                ) : null}
                {options.map((option: any, index) =>
                    multiple ? (
                        <MenuItem
                            key={index}
                            value={option[optionValue]}
                            disabled={selectedOptions.includes("")}
                        >
                            <STkCheckbox checked={selectedOptions.includes(option[optionValue])} />
                            <label>{option[optionLabel]}</label>
                        </MenuItem>
                    ) : (
                        <MenuItem key={index} value={option[optionValue]}>
                            {option[optionLabel]}
                        </MenuItem>
                    )
                )}
            </Select>
        </ThemeProvider>
    );
}

export default STKSelect;
