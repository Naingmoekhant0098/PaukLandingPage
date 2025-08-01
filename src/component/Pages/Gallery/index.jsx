import React, { useRef, useState } from "react";
import logo from "./logo.png";
function Gallery() {
  const canvasRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [combinedImageReady, setCombinedImageReady] = useState(false);
  const[isReadyDownload,setIsReadyDownload] = useState(false);
//   const [isGeneratin, setisGenerating] = useState(false);
  const [isModalShow , setIsModalShow] = useState(false);
  const [fileName,setFileName] =useState("");
  const handleFileChange = (e, setImageUrl) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) {
      alert("Image Not Fount Please Try Again");
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  const drawImagesOnCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !photoUrl || !logoUrl) {
      alert("Please select both a photo and a logo to combine.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("Could not get canvas context. Your browser might not support it.");
      return;
    }
    setCombinedImageReady(true);

    const photoImage = new Image();
    photoImage.crossOrigin = "anonymous";
    photoImage.src = photoUrl;

    const logoImage = new Image();
    logoImage.crossOrigin = "anonymous";
    logoImage.src = logoUrl;

    try {
      await Promise.all([
        new Promise((resolve, reject) => {
          photoImage.onload = () => resolve();
          photoImage.onerror = () => reject(new Error("Failed to load photo."));
        }),
        new Promise((resolve, reject) => {
          logoImage.onload = () => resolve();
          logoImage.onerror = () => reject(new Error("Failed to load logo."));
        }),
      ]);

      canvas.width = photoImage.naturalWidth;
      canvas.height = photoImage.naturalHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(photoImage, 0, 0);

      const logoX = 30;
      const logoY = 30;
      const logoScale = 0.6;
      const logoWidth = logoImage.naturalWidth * logoScale;
      const logoHeight = logoImage.naturalHeight * logoScale;

      ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

      setCombinedImageReady(false);
      setIsReadyDownload(true);
    } catch (error) {
      console.error("Error combining images:", error);
      alert(
        "Failed to load one or both images. Please ensure they are valid image files."
      );
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas || !combinedImageReady) {
      const image = canvas.toDataURL("/image/png");
      const link = document.createElement("a");
      link.download = `${fileName}.png` ;
      link.href = image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsModalShow(false);
    } else {
      alert("Please combine images first before attempting to download.");
    }
  };
  return (
    <div className=" min-h-screen max-h-screen bg-gradient-to-tr from-blue-300  to-blue-100 relative">
        <div className={` absolute top-0 inset-0 flex justify-center items-center z-50  bg-black/40  transition-all duration-300 ${isModalShow ? " opacity-100 visible" : " hidden opacity-0"}`}>
                <div className=" bg-white/40 backdrop-blur-sm h-auto  p-5 rounded-lg">
                    <div >
                        Enter File Name Here !
                    </div>
                    <input type="text" onChange={(e)=>setFileName(e.target.value)} placeholder="File Name"  className=" border mt-4 rounded-md p-3 w-full border-white/40 text-[14px]"/>
                    <div className=" flex gap-2 mt-6">
                        <button  disabled={combinedImageReady} onClick={handleDownload}  className="w-full py-3 px-4 bg-white/40 backdrop-blur-sm transition-all duration-300 cursor-pointer text-[15px] text-black/90 font-medium rounded-md shadow-sm
                     hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
              > Confirm</button>
                <button onClick={()=>setIsModalShow(false)}   className="w-full py-3 px-4 backdrop-blur-sm transition-all duration-300 cursor-pointer text-[15px] text-black/90 font-medium rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
              > Close</button>
                       
                    </div>
                </div>
        </div>
      <div className=" flex justify-center mt-0 ">
        <img src={logo} className=" w-40 h-40" alt="" />
      </div>
      {/* <div className=' text-center text-lg'>
        Upload a photo and a logo, then combine them into a single image. 
        </div> */}
      <div className=" w-[70%] mx-auto grid grid-cols-2  ">
        <div>
          <div className="grid w-full max-w-md gap-6 mb-8 border-r border-gray-300 p-6 ">
            <div className="space-y-2">
              <label
                htmlFor="photo-upload"
                className="block text-lg uppercase font-medium text-gray-700"
              >
                Upload Main Photo
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/png , image/jpeg"
                onChange={(e) => handleFileChange(e, setPhotoUrl)}
                className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
              />
              {photoUrl && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={photoUrl || "/placeholder.svg"}
                    alt="Uploaded Photo Preview"
                    className="max-h-50 object-contain rounded-md border border-gray-200 shadow-sm"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="logo-upload"
                className="block text-lg uppercase font-medium text-gray-700"
              >
                Upload Logo
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setLogoUrl)}
                className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
              />
              {logoUrl && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={logoUrl || "/placeholder.svg"}
                    alt="Uploaded Logo Preview"
                    className="max-h-40 object-contain rounded-md border border-gray-200 shadow-sm"
                  />
                </div>
              )}
            </div>
            <button
              onClick={drawImagesOnCanvas}
              disabled={!photoUrl || !logoUrl || combinedImageReady}
              className="w-full py-4 px-8 bg-white/40 backdrop-blur-sm transition-all duration-300 cursor-pointer text-[15px] text-black/90 font-medium rounded-md shadow-sm
                     hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!combinedImageReady ? "Combine Images" : "generating...."}
            </button>
          </div>
        </div>
        <div>
        <label
                htmlFor="photo-upload"
                className="block text-lg uppercase mb-3 font-medium text-gray-700"
              >
                generated image 
              </label>
          <div className="border border-gray-200 rounded-lg min-h-[400px] overflow-hidden shadow-sm mb-8 bg-white/40 backdrop-blur-sm flex justify-center items-center p-2">
            <canvas ref={canvasRef} className="max-w-full  border-gray-300" />
          </div>
          <button
            onClick={()=>setIsModalShow(true)}
            disabled={!photoUrl || !logoUrl || !isReadyDownload}
            className="w-full py-4 px-8 bg-white/40 backdrop-blur-sm transition-all duration-300 cursor-pointer text-[15px] text-black/90 font-medium rounded-md shadow-sm
                     hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
