import React from 'react'
import { FormControl, FormField, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { CustomInputProps } from '@/types'

const CustomInput = ({control, name, placeholder, label, type}: CustomInputProps) => {
  return (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <div className="form-item">
                <FormLabel className="form-label" >{label}</FormLabel>
                <div className="flex w-full flex-col">
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            className="input-class"
                            {...field}
                            type={type}
                        />
                    </FormControl>
                    <FormMessage className="form-message mt-3" />
                </div>
            </div>
        )}
    />
  )
}

export default CustomInput