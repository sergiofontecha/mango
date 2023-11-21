import RangeSlider from '../ui/rangeSlider/rangeSlider'
import { GetFixedValues } from '../share/initialValuesService'
import { RangeValues } from '../share/interfaces'
import { RangeType } from '@/app/share/enums'

export default async function FixedValuesRangeSlider() {
  const data: RangeValues | undefined = await GetFixedValues()
  const initialValues = JSON.parse(JSON.stringify(data))

  return (
    <>
      <div className="min-w-full flex justify-center gap-6 rounded-lgbg-gray-50 px-6 md:w-2/5 md:px-20">
        <p className={`text-xl text-center text-gray-800 md:text-3xl md:leading-normal`}>
          <strong>This is a fixed values range example</strong>
        </p>
      </div>
      <RangeSlider rangeType={RangeType.FIXED} initialValues={initialValues} />
    </>
  )
}
