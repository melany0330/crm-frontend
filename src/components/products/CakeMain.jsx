import React from 'react'
import LayerCakeSlider from '../../components/products/LayerCakeSlider'
import CupCakeSlider from '../../components/products/CupCakeSlider'
import DonutsSlider from '../../components/products/DonutsSlider' 
import FeaturedSection2 from '../../components/products/FeatureSection2'


const CakeShopMain = () => {
  return (
    <main>
      <LayerCakeSlider/>
      <CupCakeSlider/>
      <DonutsSlider/>
      <FeaturedSection2/>
    </main>
  )
}

export default CakeShopMain