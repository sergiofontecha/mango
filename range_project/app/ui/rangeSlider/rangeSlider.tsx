'use client'

import { useState, useRef, useEffect } from 'react'
import { chooseNextStep, setBulletPosition, getNewMinValue, getNewMaxValue } from '@/app/share/utils'
import { RangeValues } from '@/app/share/interfaces'
import { InputType, RangeType } from '@/app/share/enums'

export default function RangeSlider({
  initialValues,
  rangeType,
}: {
  initialValues: RangeValues
  rangeType: RangeType
}) {
  const minInitialValue = initialValues.values[0]
  const maxInitialValue = initialValues.values[initialValues.values.length - 1]
  const [currentValues, setCurrentValues] = useState<any>({ min: minInitialValue, max: maxInitialValue })
  const [position, setPosition] = useState({ min: minInitialValue, max: maxInitialValue })
  const [drag, setDrag] = useState<InputType | null>(null)
  const [dragging, setDragging] = useState<boolean>(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const minBulletRef = useRef<HTMLDivElement>(null)
  const maxBulletRef = useRef<HTMLDivElement>(null)
  const minInputRef = useRef<HTMLInputElement>(null)
  const maxInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, element: InputType) => {
    const newMin: number = element === InputType.MIN ? parseInt(e.target.value) : currentValues.min
    const newMax: number = element === InputType.MAX ? parseInt(e.target.value) : currentValues.max

    setCurrentValues({
      min: getNewMinValue(newMin, minInitialValue, currentValues.max),
      max: getNewMaxValue(newMax, maxInitialValue, currentValues.min),
    })
    setPosition({
      min: getNewMinValue(newMin, minInitialValue, currentValues.max),
      max: getNewMaxValue(newMax, maxInitialValue, currentValues.min),
    })
  }

  const parseValues = (value: any): void => {
    let newValues: any
    setPosition(value)

    if (rangeType === RangeType.FIXED) {
      newValues = chooseNextStep(value, initialValues.values)
    } else {
      newValues = { min: Math.round(value.min), max: Math.round(value.max) }
    }

    if (newValues.min !== currentValues.min || newValues.max !== currentValues.max) {
      setCurrentValues(newValues)
    }
  }

  const handleMouseMove = (event: any) => {
    let clientX: any

    if (!dragging) return

    clientX = event.clientX
    const sliderRect = sliderRef.current!.getBoundingClientRect()
    const position = (clientX - sliderRect.left) / sliderRect.width
    if (position < 0 || position > 1) return
    const newValue = minInitialValue + position * (maxInitialValue - minInitialValue)
    if (drag === InputType.MIN && newValue < currentValues.max - 1) {
      parseValues({ ...currentValues, min: newValue })
    } else if (drag === InputType.MAX && newValue > currentValues.min + 1) {
      parseValues({ ...currentValues, max: newValue })
    }
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  const handleMouseDown = (type: InputType) => {
    setDragging(true)
    setDrag(type)
  }

  const changeBulletPosition = (values: any): void => {
    position.max = values.max
    position.min = values.min
  }

  const updateInput = (value: number, input: InputType) => {
    switch (input) {
      case InputType.MIN:
        if (value < minInitialValue) {
          value = minInitialValue
        }
        if (value >= currentValues.max) {
          value = currentValues.max - 1
        }
        parseValues({ ...currentValues, min: value })
        changeBulletPosition({ ...currentValues, min: value })
        break
      case InputType.MAX:
        if (value > maxInitialValue) {
          value = maxInitialValue
        }
        if (value <= currentValues.min) {
          value = currentValues.min + 1
        }
        parseValues({ ...currentValues, max: value })
        changeBulletPosition({ ...currentValues, max: value })
        break
    }
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
  }, [])

  useEffect(() => {
    if (!dragging) {
      if (drag) {
        updateInput(currentValues[drag], drag)
      }
      changeBulletPosition(currentValues)
      setDrag(null)
    }
  }, [])

  return (
    <div className="flex justify-between items-center my-6">
      <div className="flex items-center relative  w-full">
        {rangeType === RangeType.NORMAL ? (
          <input
            type="number"
            className="w-16 p-0.5 rounded-md border text-right border-gray-400 mr-5"
            ref={minInputRef}
            value={currentValues.min}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, InputType.MIN)}
          />
        ) : (
          <span className="w-24 text-right mr-4">{currentValues.min}</span>
        )}
        <div
          className="w-full h-12 relative before:block before:absolute before:-inset-x-0 before:h-1.5 before:mt-5 before:bg-gray-800"
          ref={sliderRef}
          onMouseMove={handleMouseMove}
        >
          <div
            className="w-6 h-6 absolute rounded-full mt-2.5 bg-gray-800 cursor-grab hover:w-8 hover:h-8 hover:mt-1.5 hover:cursor-grabbing"
            ref={minBulletRef}
            onMouseDown={() => handleMouseDown(InputType.MIN)}
            style={{ left: setBulletPosition(position.min, minBulletRef, minInitialValue, maxInitialValue) }}
          ></div>
          <div
            className="w-6 h-6 absolute rounded-full mt-2.5 bg-gray-800 cursor-grab hover:w-8 hover:h-8 hover:mt-1.5 hover:cursor-grabbing"
            ref={maxBulletRef}
            onMouseDown={() => handleMouseDown(InputType.MAX)}
            style={{ left: setBulletPosition(position.max, maxBulletRef, minInitialValue, maxInitialValue) }}
          ></div>
        </div>
        {rangeType === RangeType.NORMAL ? (
          <input
            type="number"
            className="w-16 p-0.5 rounded-md border border-gray-400 ml-5"
            ref={maxInputRef}
            value={currentValues.max}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, InputType.MAX)}
          />
        ) : (
          <span className="w-24 text-center ml-1.5">{currentValues.max}</span>
        )}
      </div>
    </div>
  )
}
