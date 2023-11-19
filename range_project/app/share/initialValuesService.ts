import { NormalInitialValues } from './interfaces'

export async function GetNormalValues() {
  const requestOptions: RequestInit = {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  }

  try {
    const response = await fetch('http://localhost:3000/api/normalValues', requestOptions)
    if (response.ok) {
      const initialValues = await response.json()
      return initialValues as unknown as NormalInitialValues
    }
  } catch (error) {
    throw new Error('Failed to fetch data.')
  }
}
