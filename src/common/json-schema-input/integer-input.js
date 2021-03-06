import React from 'react'

import AbstractInput from './abstract-input'
import Combobox from '../combobox'
import { PrimitiveInputWrapper } from './helpers'

// ===================================================================

export default class IntegerInput extends AbstractInput {
  get value () {
    const { value } = this.refs.input
    return !value ? undefined : +value
  }

  set value (value) {
    // Getter/Setter are always inherited together.
    // `get value` is defined in the subclass, so `set value`
    // must be defined too.
    super.value = value
  }

  render () {
    const { props } = this
    const { schema } = props

    return (
      <PrimitiveInputWrapper {...props}>
        <Combobox
          defaultValue={props.defaultValue}
          disabled={props.disabled}
          onChange={props.onChange}
          options={schema.defaults}
          placeholder={props.placeholder || schema.default}
          ref='input'
          required={props.required}
          step={1}
          type='number'
        />
      </PrimitiveInputWrapper>
    )
  }
}
