import {MenuItem, Select, ThemeProvider} from "@mui/material";
import theme from "@/components/theme";
import {useEffect, useState} from "react";
import STkCheckbox from "@/components/STKCheckbox/STKCheckbox";

interface STKSelectProps {
    options: Array<Object>
    optionValue?: string
    optionLabel?: string
    placeholder?: string
    multiple?: boolean
    value?: object
    id?: string
    fluid?: boolean
    onChange: Function
}

function STKSelect({
    options = [],
    fluid,
    value,
    multiple,
    placeholder,
    optionValue = "value",
    optionLabel = "label",
    id,
    onChange = (selectedOption: any) => ({})
}: STKSelectProps) {
    const [optionsHash, setOptionsHash] = useState({})
    const [selectedOptions, setSelectedOptions] = useState([])

    useEffect(() => {
        setOptionsHash(options.reduce((acc, item) => {
            // @ts-ignore
            acc[item[optionValue]] = item[optionLabel]

            return acc
        }, {}))
    }, [options]);

    const handleChange = (e: Event) => {
        // @ts-ignore
        const { value } = e.target
        if (value === null) return

        if (multiple) {
            setSelectedOptions(value)
            onChange(value)
        } else {
            // @ts-ignore
            const _selectedOption = options.find((option) => value === option[optionValue])
            onChange(_selectedOption)
        }
    }

    const getRenderInputValue = (value: any) => {
        if (!multiple) return value

        // @ts-ignore
        return value.map((_value: any) => optionsHash[_value]).join(', ')
    }

    return (
        <ThemeProvider theme={theme}>
            <Select
                id={id}
                multiple={multiple}
                displayEmpty
                renderValue={(selected) => {
                    // @ts-ignore
                    if (selected?.length === 0) {
                        return <label className="text-neutral-400">{placeholder}</label>
                    }
                    return getRenderInputValue(selected)
                }}
                value={multiple ? selectedOptions : value}
                sx={{ width: fluid ? '100%' : '300px', backgroundColor: "white" }}
                // @ts-ignore
                onChange={handleChange}
            >
                {options?.map((option: any, index) => (
                    multiple ? (
                        <MenuItem
                        key={index}
                        value={option[optionValue]}>
                            <STkCheckbox
                            // @ts-ignore
                            checked={selectedOptions && selectedOptions?.includes(option[optionValue])} />
                            <label>{option[optionLabel]}</label>
                        </MenuItem>
                    ) : (
                        // @ts-ignore
                        <MenuItem key={index} value={option[optionValue]}>{option[optionLabel]}</MenuItem>
                    )
                ))}
            </Select>
        </ThemeProvider>
    )
}


export default STKSelect
