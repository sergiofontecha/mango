'use client'

import { useState, useEffect, useRef } from 'react'
import { NormalInitialValues } from '@/app/share/interfaces'

export default function RangeSlider({ initialValues }: { initialValues: NormalInitialValues }) {
  const progressRef = useRef(null) as any
  const [minValue, setMinValue] = useState(initialValues.initialMin)
  const [maxValue, setMaxValue] = useState(initialValues.initialMax)

  const handleMin = (e: any): void => {
    if (maxValue - minValue >= initialValues.value && maxValue <= initialValues.max) {
      if (parseInt(e.target.value) > maxValue && minValue < maxValue) {
        setMinValue(maxValue - 10)
      } else {
        setMinValue(parseInt(e.target.value))
      }
    }
  }

  const handleMax = (e: any): void => {
    if (maxValue - minValue >= initialValues.value && maxValue <= initialValues.max) {
      if (parseInt(e.target.value) < minValue && maxValue > minValue) {
        setMaxValue(minValue + 10)
      } else {
        setMaxValue(parseInt(e.target.value))
      }
    }
  }

  useEffect(() => {
    if (progressRef.current !== undefined) {
      progressRef.current.style.left = (minValue / initialValues.max) * initialValues.step + '%'
      progressRef.current.style.right = initialValues.step - (maxValue / initialValues.max) * initialValues.step + '%'
    }
  }, [minValue, maxValue, initialValues.max, initialValues.step])

  return (
    <>
      <div className="flex justify-between items-center my-6">
        <div className="rounded-md">
          <span className="p-2 font-semibold"> Min</span>
          <input
            onChange={(e) => {
              if (parseInt(e.target.value) >= maxValue) {
                setMinValue(maxValue - 5)
              } else {
                setMinValue(parseInt(e.target.value))
              }
            }}
            type="number"
            value={minValue}
            className="w-24 rounded-md border border-gray-400"
          />
        </div>
        <div className="rounded-md">
          <span className="p-2 font-semibold"> Max</span>
          <input
            onChange={(e) => {
              if (parseInt(e.target.value) <= minValue) {
                setMaxValue(minValue + 5)
              } else {
                setMaxValue(parseInt(e.target.value))
              }
            }}
            type="number"
            value={maxValue}
            className="w-24 rounded-md border border-gray-400"
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="slider relative h-1 rounded-md bg-gray-800">
          <div className="progress absolute h-1 rounded " ref={progressRef}></div>
        </div>

        <div className="range-input relative  ">
          <input
            onChange={handleMin}
            type="range"
            min={initialValues.min}
            step={initialValues.step}
            max={initialValues.max}
            value={minValue}
            className="range-min absolute w-full -top-1 h-1 bg-transparent appearance-none pointer-events-none"
          />

          <input
            onChange={handleMax}
            type="range"
            min={initialValues.min}
            step={initialValues.step}
            max={initialValues.max}
            value={maxValue}
            className="range-max absolute w-full -top-1 h-1 bg-transparent appearance-none pointer-events-none"
          />
        </div>
      </div>
    </>
  )
}
