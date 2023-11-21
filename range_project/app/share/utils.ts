import { RangeValues } from '@/app/share/interfaces'

export const compareNumbers = (a: number, b: number) => {
  return a - b
}

export const setBulletsToStep = (value: any, range: number[]): any => {
  const prevDiff = {
    min: Math.abs(value.min - range[0]),
    max: Math.abs(value.max - range[0]),
  }
  let index = 0
  const intervals: any = range.reduce(
    (prev: any, curr: number, i: number): any => {
      const currDiff: any = {
        min: Math.abs(value.min - curr),
        max: Math.abs(value.max - curr),
      }
      const next: any = {
        min: prev.min,
        max: prev.max,
      }
      if (currDiff.min < prevDiff.min || (currDiff.min === prevDiff.min && curr < prev.min)) {
        prevDiff.min = currDiff.min
        next['min'] = curr
      }
      if (currDiff.max < prevDiff.max || (currDiff.max === prevDiff.max && curr < prev.max)) {
        prevDiff.max = currDiff.max
        next['max'] = curr
        index = i
      }
      return next
    },
    {
      min: range[0],
      max: range[0],
    },
  )
  if (intervals.min === intervals.max) {
    if (index > 0) {
      intervals.min = range[index - 1]
    } else {
      intervals.max = range[index + 1]
    }
  }
  return intervals
}

export const setBulletPosition = (value: number, ref: any, minValue: number, maxValue: number): string => {
  const displacement = isNaN(ref?.current?.clientWidth) ? '.5em' : `${ref.current.clientWidth / 2}px`
  return `calc(${((value - minValue) / (maxValue - minValue)) * 100}% - ${displacement})`
}

export const getNewMinValue = (newMin: number, initialMin: number, currentMax: number): number => {
  return newMin <= initialMin ? initialMin : newMin >= currentMax ? currentMax - 1 : newMin
}
export const getNewMaxValue = (newMax: number, initialMax: number, currentMin: number): number => {
  return newMax >= initialMax ? initialMax : newMax <= currentMin ? currentMin + 1 : newMax
}
