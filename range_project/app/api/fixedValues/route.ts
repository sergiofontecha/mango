import { NextResponse } from 'next/server'
import fsPromises from 'fs/promises'
import path from 'path'

const initialValuesPath = path.join(process.cwd(), 'public/mocks/FixedValues.json')

export async function GET() {
  try {
    const initialValues = await fsPromises.readFile(initialValuesPath, 'utf-8')
    const initialValuesJson = JSON.parse(initialValues)
    return NextResponse.json(initialValuesJson)
  } catch (e) {
    return new NextResponse(JSON.stringify({ message: 'There was an error trying to get initial data' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    })
  }
}
