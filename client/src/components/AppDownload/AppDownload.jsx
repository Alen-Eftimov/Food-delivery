import React from 'react'
import './app_download.scss'
import { assets } from '../../assets/frontend_assets/assets'

const AppDownload = () => {
  return (
    <div className="app-download" id='app-download' >
      <p>For Better Experience Download <br /> Food4U App</p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="" />
        <img src={assets.app_store} alt="" />
      </div>

    </div>
  )
}

export default AppDownload
