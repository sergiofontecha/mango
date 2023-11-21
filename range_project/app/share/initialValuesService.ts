import { RangeValues } from './interfaces'

const requestOptions: RequestInit = {
  method: 'GET',
  headers: { 'content-type': 'application/json' },
}

export async function GetNormalValues() {
  try {
    const response = await fetch('http://localhost:3000/api/normalValues', requestOptions)
    if (response.ok) {
      const initialValues = await response.json()
      return initialValues as unknown as RangeValues
    }
  } catch (error) {
    throw new Error('Failed to fetch data.')
  }
}

export async function GetFixedValues() {
  try {
    const response = await fetch('http://localhost:3000/api/fixedValues', requestOptions)
    if (response.ok) {
      const initialValues = await response.json()
      return initialValues as unknown as RangeValues
    }
  } catch (error) {
    throw new Error('Failed to fetch data.')
  }
}
