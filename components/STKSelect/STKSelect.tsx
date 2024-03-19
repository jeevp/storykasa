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
    color?: string
    enableSelectAll?: boolean
    selectAllLabel?: string
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
    enableSelectAll,
    color,
    selectAllLabel = "All",
    placeholder,
    optionValue = "value",
    optionLabel = "label",
    id,
    onChange = (selectedOption: any) => ({})
}: STKSelectProps) {
    const [optionsHash, setOptionsHash] = useState({})
    const [selectedOptions, setSelectedOptions] = useState([])
    const [cleanSelectedOptions, setCleanSelectedOptions] = useState(false)

    useEffect(() => {
        setOptionsHash(options.reduce((acc, item) => {
            // @ts-ignore
            acc[item[optionValue]] = item[optionLabel]

            return acc
        }, {}))
    }, [options]);

    useEffect(() => {
        if (multiple && Array.isArray(value)) {
            const options = value.map(val => val[optionValue])
            if (value.includes("")) options.push("")
            // @ts-ignore
            setSelectedOptions(options);
        } else if (!multiple && value) {
            // @ts-ignore
            setSelectedOptions([value[optionValue]]);
        } else {
            setSelectedOptions([]);
        }
    }, [value, multiple, optionValue]);

    const handleChange = (e: Event) => {
        e.stopPropagation()
        // @ts-ignore
        const { value } = e.target
        if (value === null) return

        if (multiple) {
            // @ts-ignore
            if (e?.target?.value?.includes("")) {
                // @ts-ignore
                const _options = [...options.map((option) => option[optionValue]), ""]
                // @ts-ignore
                setSelectedOptions(_options)
                onChange(_options.filter((_option) => _option !== ""))
            } else {
                // @ts-ignore
                setSelectedOptions(cleanSelectedOptions || selectedOptions.includes("") ? [] : value)
                // @ts-ignore
                onChange(cleanSelectedOptions  || selectedOptions.includes("") ? [] : value)
            }
        } else {
            // @ts-ignore
            const _selectedOption = options.find((option) => value === option[optionValue])
            onChange(_selectedOption)
        }
    }

    const getRenderInputValue = (value: any) => {
        if (!multiple) return value

        if (value.includes("")) {
            return "All ages"
        }

        // @ts-ignore
        return value.map((_value: any) => optionsHash[_value]).join(', ')
    }

    const handleAllOnClick = () => {
        // @ts-ignore
        setCleanSelectedOptions(!selectedOptions.includes(""))
    }

    return (
        <ThemeProvider theme={theme}>
            <Select
                id={id}
                multiple={multiple}
                displayEmpty
                color={color}
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
                {enableSelectAll ? (
                    <MenuItem value={""} onClick={handleAllOnClick}>
                        <STkCheckbox
                        // @ts-ignore
                        checked={selectedOptions && selectedOptions?.includes("")}/>
                        <label>{selectAllLabel}</label>
                    </MenuItem>
                ) : null}
                {options?.map((option: any, index) => (
                    multiple ? (
                        <MenuItem
                        // @ts-ignore
                        className={selectedOptions.includes("") ? 'disabled' : ''}
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



