'use client'

import { useState, useRef, useEffect } from 'react'
import { setBulletsToStep, setBulletPosition } from '@/app/share/utils'
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
  const [position, setPosition] = useState({ min: initialValues.min, max: initialValues.max })
  const [values, setValues] = useState<any>({ min: initialValues.min, max: initialValues.max })
  const [tempValues, setTempValues] = useState<{ [key: string]: number | null }>({})
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragType, setDragType] = useState<InputType.MIN | InputType.MAX | null>(null)
  const rangeLineRef = useRef<HTMLDivElement>(null)
  const minBulletRef = useRef<HTMLDivElement>(null)
  const maxBulletRef = useRef<HTMLDivElement>(null)
  const minInputRef = useRef<HTMLInputElement>(null)
  const maxInputRef = useRef<HTMLInputElement>(null)

  const onChange = (values: any): void => {
    initialValues.max = values.max
    initialValues.min = values.min
  }

  useEffect(() => {
    onChange({ min: initialValues.min, max: initialValues.max })
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
      console.log('dentro', newValues)
    }

    if (newValues.min !== values.min || newValues.max !== values.max) {
      setValues(newValues)
      console.log('dentro2', values)
    }
  }

  const updateInput = (value: number, input: InputType.MIN | InputType.MAX) => {
    if (isNaN(value)) {
      escape()
      return
    }
    switch (input) {
      case InputType.MIN:
        if (value < initialValues.min) {
          value = initialValues.min
        }
        if (value >= values.max) {
          value = values.max - 1
        }
        parseValues({ ...values, min: value })
        onChange({ ...values, min: value })
        break
      case InputType.MAX:
        if (value > initialValues.max) {
          value = initialValues.max
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
    setTempValues({
      min: tempValues.min || values.min,
      max: tempValues.max || values.max,
    })
    setValues({
      min: input === InputType.MIN ? parseInt(e.target.value) : values.min,
      max: input === InputType.MAX ? parseInt(e.target.value) : values.max,
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
    const newValue = initialValues.min + position * (initialValues.max - initialValues.min)
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
        <input
          type="number"
          className="w-24 rounded-md border border-gray-400 mr-4"
          ref={minInputRef}
          value={values.min}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, InputType.MIN)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyboard(event, InputType.MIN)}
          onBlur={() => escape()}
        />
        <div className="range__line" ref={rangeLineRef} onMouseMove={handleMouseMove} onTouchMove={handleMouseMove}>
          <div
            className="range__bullet bg-gray-800"
            ref={minBulletRef}
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, InputType.MIN)}
            onTouchStart={(e: React.TouchEvent) => handleMouseDown(e, InputType.MIN)}
            style={{ left: setBulletPosition(position.min, maxBulletRef, initialValues) }}
          ></div>
          <div
            className="range__bullet  bg-gray-800"
            ref={maxBulletRef}
            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, InputType.MAX)}
            onTouchStart={(e: React.TouchEvent) => handleMouseDown(e, InputType.MAX)}
            style={{ left: setBulletPosition(position.max, maxBulletRef, initialValues) }}
          ></div>
        </div>
        <input
          type="number"
          className="w-24 rounded-md border border-gray-400 ml-4"
          ref={maxInputRef}
          value={values.max}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, InputType.MAX)}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyboard(event, InputType.MAX)}
          onBlur={() => escape()}
        />
      </div>
    </div>
  )
}
