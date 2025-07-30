import React from 'react'
import playStore from "../../../assets/playstore.png";
import { FaDownload } from "react-icons/fa";
import mockup from "../../../assets/mockup.jpg";
function Home() {
  return (
    <div className=" w-screen h-auto md:h-screen mt-20 pb-12 md:mt-0   bg-gradient-to-t flex  justify-center items-center">
      <div className=" w-full md:w-[80%]  mt-10   flex  justify-between flex-col md:flex-row gap-12  px-4 text-center md:text-left ">
        <div className=" space-y-10 flex flex-col  justify-center    gap-3 w-full  md:w-[70%]">
          <div className=" font-black text-4xl mb-2">
            Download Pauk Thae 2D 3D Application
          </div>
          <div className=" text-[16px] text-black font-medium">
            Discover the Mingalar App: your gateway to seamless connections,
            interactive features, and a vibrant community. Download now and
            explore the possibilities!
          </div>

          <div className="flex   sm:flex-row  gap-3 md:gap-4 justify-center md:justify-start">
            <a
              href={"https://bit.ly/43TsgbI"}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3  bg-[#252B42] text-white   px-4 md:px-6  py-4 rounded-xl  text-sm md:text-base font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <img
                src={playStore}
                className="w-8 h-8 fill-current"
              />
              <div className="text-left">
                <div className="text-xs opacity-90">Get it on</div>
                <div className="font-semibold">Google Play</div>
              </div>
            </a>
            <a
              href={"https://bit.ly/43TsgbI"}
              className="group flex items-center justify-center gap-3  bg-[#252B42] text-white   px-4 md:px-6  py-4 rounded-xl  text-sm md:text-base font-medium transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <FaDownload className="w-5 h-5" />
              <div className="text-left">
                <div className="text-xs opacity-90">Direct</div>
                <div className="font-semibold">Download APK</div>
              </div>
            </a>
          </div>
        </div>

        <div className="  ">
          <img src={mockup} className=" w-full md:w-[500px]  mx-auto rounded-lg md:h-[400px] shadow-lg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Home