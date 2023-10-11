import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import {useEffect, useState} from "react";
import {ThemeProvider} from "@mui/material";
import theme from "@/components/theme";

interface STKRadioGroupProps {
    options: Array<Object>
    optionLabel: string
    optionValue: string
    value: string,
    onChange: (value: string) => void
}

export default function STKRadioGroup(props: STKRadioGroupProps) {
    const [internalValue, setInternalValue] = useState<string>("")

    useEffect(() => {
        if (props.value) {
            setInternalValue(props.value)
        }
    }, [props.value]);
    const handleChange = (e: Event) => {
        // @ts-ignore
        const { value } = e.target

        setInternalValue(value)
        props.onChange(value)
    }

    return (
        <ThemeProvider theme={theme}>
            <FormControl>
                <RadioGroup
                    row
                    value={internalValue}
                    // @ts-ignore
                    onChange={handleChange}
                >
                    {props.options.map((option: any, index: number) => (
                        <FormControlLabel
                        key={index}
                        value={option[props.optionValue]}
                        control={<Radio />}
                        label={option[props.optionLabel]} />
                    ))}
                </RadioGroup>
            </FormControl>
        </ThemeProvider>
    )
}
