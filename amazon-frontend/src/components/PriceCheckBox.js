import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import React, {useState, useEffect} from 'react'
import "../styles/PriceCheckBox.css"


const PriceCheckBox = (props) => {

    const [value, setValue] = useState('0');

    useEffect(() => {
        // Reset filter when clear button is clicked (when range is set to default)
        setValue('0');
    }, [props.resetTrigger]);

    const handleToggle = (value) => {
        setValue(value);
        props.handleFilters(value);
    }

    

    return (
        <div className="price-range-container">
            {props.list.map((price, index)=>(
                <span className="price-range-checkbox" key={price.id}>
                    
                    <RadioGroup defaultValue="Any" name="customized-radios" value={value}
                    onChange = {() => handleToggle(price.id)}>

                        <FormControlLabel value={price.id} control={<Radio />} label={price.name} />

                    </RadioGroup>
                </span>
            ))}
        </div>
    )
}

export default PriceCheckBox
