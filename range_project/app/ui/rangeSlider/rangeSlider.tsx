'use client'

import { useState, useRef, useEffect } from 'react'
import { setBulletsToStep, setBulletPosition, getNewMinValue, getNewMaxValue } from '@/app/share/utils'
import { RangeValues } from '@/app/share/interfaces'
import { InputType, RangeType } from '@/app/share/enums'
import './rangeSlider.css'

export default function RangeSlider({
  initialValues,
  rangeType,
}: {
  initialValues: RangeValues
  rangeType: RangeType
}) {
  const minValue = initialValues.values[0]
  const maxValue = initialValues.values[initialValues.values.length - 1]
  const [position, setPosition] = useState({ min: minValue, max: maxValue })
  const [values, setValues] = useState<any>({ min: minValue, max: maxValue })
  const [tempValues, setTempValues] = useState<{ [key: string]: number | null }>({})
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragType, setDragType] = useState<InputType.MIN | InputType.MAX | null>(null)
  const rangeLineRef = useRef<HTMLDivElement>(null)
  const minBulletRef = useRef<HTMLDivElement>(null)
  const maxBulletRef = useRef<HTMLDivElement>(null)
  const minInputRef = useRef<HTMLInputElement>(null)
  const maxInputRef = useRef<HTMLInputElement>(null)

  const onChange = (values: any): void => {
    position.max = values.max
    position.min = values.min
  }

  useEffect(() => {
    onChange({ min: minValue, max: maxValue })
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchend', handleMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchend', handleMouseUp)
    }
  }, [])

  useEffect(() => {
    if (!isDragging) {
      if (dragType) {
        updateInput(values[dragType], dragType)
      }
      onChange(values)
      setDragType(null)
    }
  }, [isDragging])

  const parseValues = (value: any): void => {
    let newValues: any
    setPosition(value)

    if (rangeType === RangeType.FIXED) {
      if (!initialValues.values) return
      newValues = setBulletsToStep(value, initialValues.values)
    } else {
      newValues = { min: Math.round(value.min), max: Math.round(value.max) }
    }

    if (newValues.min !== values.min || newValues.max !== values.max) {
      setValues(newValues)
    }
  }

  const updateInput = (value: number, input: InputType.MIN | InputType.MAX) => {
    if (isNaN(value)) {
      escape()
      return
    }
    switch (input) {
      case InputType.MIN:
        if (value < minValue) {
          value = minValue
        }
        if (value >= values.max) {
          value = values.max - 1
        }
        parseValues({ ...values, min: value })
        onChange({ ...values, min: value })
        break
      case InputType.MAX:
        if (value > maxValue) {
          value = maxValue
        }
        if (value <= values.min) {
          value = values.min + 1
        }
        parseValues({ ...values, max: value })
        onChange({ ...values, max: value })
        break
    }
    cleanTemps()
  }

  const cleanTemps = () => {
    setTempValues({
      min: null,
      max: null,
    })
  }

  const escape = () => {
    setValues({
      min: tempValues.min || values.min,
      max: tempValues.max || values.max,
    })
    cleanTemps()
    blurInputs()
  }

  const blurInputs = () => {
    minInputRef.current!.blur()
    maxInputRef.current!.blur()
  }

  const handleKeyboard = (event: React.KeyboardEvent<HTMLInputElement>, input: InputType.MIN | InputType.MAX) => {
    switch (event.key) {
      case 'Enter':
        updateInput(input === InputType.MIN ? values.min : values.max, input)
        break
      case 'Escape':
        escape()
        break
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, input: InputType) => {
    const newMin: number = input === InputType.MIN ? parseInt(e.target.value) : values.min
    const newMax: number = input === InputType.MAX ? parseInt(e.target.value) : values.max

    setTempValues({
      min: tempValues.min || values.min,
      max: tempValues.max || values.max,
    })
    setValues({
      min: getNewMinValue(newMin, minValue, values.max),
      max: getNewMaxValue(newMax, maxValue, values.min),
    })
    setPosition({
      min: getNewMinValue(newMin, minValue, values.max),
      max: getNewMaxValue(newMax, maxValue, values.min),
    })
  }

  const handleMouseMove = (event: any) => {
    if (!isDragging) return
    let clientX: any
    if (window.TouchEvent && (event.originalEvent instanceof TouchEvent || event.nativeEvent instanceof TouchEvent)) {
      clientX = event.touches[0].clientX
    } else {
      clientX = event.clientX
    }
    const rangeLineRect = rangeLineRef.current!.getBoundingClientRect()
    const position = (clientX - rangeLineRect.left) / rangeLineRect.width
    if (position < 0 || position > 1) return
    const newValue = minValue + position * (maxValue - minValue)
    if (dragType === InputType.MIN && newValue < values.max - 1) {
      parseValues({ ...values, min: newValue })
    } else if (dragType === InputType.MAX && newValue > values.min + 1) {
      parseValues({ ...values, max: newValue })
    }
  }

  const handleMouseUp = (event: Event) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleMouseDown = (event: any, type: InputType.MIN | InputType.MAX) => {
    event.preventDefault()
    setIsDragging(true)
    setDragType(type)
  }

  return (
    <div className="flex justify-between items-center my-6">
      <div className="range__container">
        {rangeType === RangeType.NORMAL ? (
          <input
            type="number"
            className="w-24 rounded-md border border-gray-400 mr-4"
            ref={minInputRef}
            value={values.min}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, InputType.MIN)}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyboard(event, InputType.MIN)}
            onBlur={() => escape()}
          />
        ) : (
          <span className="w-24 text-right mr-4">{values.min}</span>
        )}
        <div className="range__line" ref={rangeLineRef} onMouseMove={handleMouseMove} onTouchMove={handleMouseMove}>
          <div
            className="range__bullet bg-gray-800"
            ref={minBulletRef}
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, InputType.MIN)}
            onTouchStart={(e: React.TouchEvent) => handleMouseDown(e, InputType.MIN)}
            style={{ left: setBulletPosition(position.min, minBulletRef, minValue, maxValue) }}
          ></div>
          <div
            className="range__bullet  bg-gray-800"
            ref={maxBulletRef}
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, InputType.MAX)}
            onTouchStart={(e: React.TouchEvent) => handleMouseDown(e, InputType.MAX)}
            style={{ left: setBulletPosition(position.max, maxBulletRef, minValue, maxValue) }}
          ></div>
        </div>
        {rangeType === RangeType.NORMAL ? (
          <input
            type="number"
            className="w-24 rounded-md border border-gray-400 ml-4"
            ref={maxInputRef}
            value={values.max}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, InputType.MAX)}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyboard(event, InputType.MAX)}
            onBlur={() => escape()}
          />
        ) : (
          <span className="w-24 text-center mr-4">{values.max}</span>
        )}
      </div>
    </div>
  )
}
