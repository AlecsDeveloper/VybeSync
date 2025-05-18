import React from 'react'
import LeftSection from './panels/LeftSection'
import CenterSection from './panels/CenterSection'
import RightSection from './panels/RightSection'

export default function MainContent(): React.JSX.Element {
  return (
    <section className="w-screen h-[calc(100%-124px)] flex items-center justify-center overflow-hidden">
      <div className="w-full h-full flex gap-2 px-2 overflow-hidden">

        <div className="w-[300px] min-w-[300px] h-full shrink-0">
          <LeftSection />
        </div>

        <div className="flex-1 h-full overflow-hidden">
          <CenterSection />
        </div>

        <div className="w-[350px] min-w-[350px] h-full hidden 2xl:block shrink-0">
          <RightSection />
        </div>

      </div>
    </section>
  )
}
