import RangeSlider from '../ui/rangeSlider/rangeSlider'
import { GetNormalValues } from '../share/initialValuesService'
import { NormalInitialValues } from '../share/interfaces'

export default async function NormalRangeSlider() {
  const data: NormalInitialValues | undefined = await GetNormalValues()
  const initialValues = JSON.parse(JSON.stringify(data))

  return (
    <>
      <div className="min-w-full flex justify-center gap-6 rounded-lgbg-gray-50 px-6 md:w-2/5 md:px-20">
        <p className={`text-xl text-center text-gray-800 md:text-3xl md:leading-normal`}>
          <strong>This is a normal range slider example</strong>
        </p>
      </div>
      <RangeSlider initialValues={initialValues} />
    </>
  )
}
