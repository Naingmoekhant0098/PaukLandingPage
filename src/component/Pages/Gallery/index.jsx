"use client"

import { useState, useCallback } from "react"

export default function Gallery() {
  const [mainPhotoFiles, setMainPhotoFiles] = useState([])
  const [logoFile, setLogoFile] = useState(null)
  const [combinedImages, setCombinedImages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [currentDownloadUrl, setCurrentDownloadUrl] = useState("")
  const [currentDownloadFileName, setCurrentDownloadFileName] = useState("")

  const handleMainPhotoChange = useCallback((e) => {
    if (e.target.files) {
      setMainPhotoFiles(Array.from(e.target.files))
      setCombinedImages([]) // Clear previous combined images when new files are selected
    }
  }, [])

  const handleLogoChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
      setCombinedImages([]) // Clear previous combined images when new logo is selected
    }
  }, [])

  const combineAndGenerateImages = async () => {
    if (mainPhotoFiles.length === 0 || !logoFile) {
      alert("Please select at least one main photo and a logo to combine.")
      return
    }

    setIsGenerating(true)
    const newCombinedImages = []

    try {
      const logoImage = new Image()
      logoImage.crossOrigin = "anonymous" 
      logoImage.src = URL.createObjectURL(logoFile)

      await new Promise((resolve, reject) => {
        logoImage.onload = () => resolve()
        logoImage.onerror = () => reject(new Error("Failed to load logo image."))
      })

      for (const mainImageFile of mainPhotoFiles) {
        const photoImage = new Image()
        photoImage.crossOrigin = "anonymous"  
        photoImage.src = URL.createObjectURL(mainImageFile)

        await new Promise((resolve, reject) => {
          photoImage.onload = () => resolve()
          photoImage.onerror = () => reject(new Error(`Failed to load main image: ${mainImageFile.name}`))
        })

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          throw new Error("Could not get canvas context. Your browser might not support it.")
        }

        canvas.width = photoImage.naturalWidth
        canvas.height = photoImage.naturalHeight

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(photoImage, 0, 0)

       
        const logoX = 40
        const logoY = 50
        const logoScale = 0.5  
        // const logoWidth = logoImage.naturalWidth * logoScale
        // const logoHeight = logoImage.naturalHeight * logoScale
         const logoWidth = 170
        const logoHeight = 170
        ctx.globalAlpha =0.5
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight)
        ctx.globalAlpha=1
        const combinedImageUrl = canvas.toDataURL("image/png")
        const fileNameWithoutExtension = mainImageFile.name.split(".").slice(0, -1).join(".") || "combined-image"
        newCombinedImages.push({ url: combinedImageUrl, name: fileNameWithoutExtension })

     
        URL.revokeObjectURL(photoImage.src)
      }
      URL.revokeObjectURL(logoImage.src)  

      setCombinedImages(newCombinedImages)
    } catch (error) {
      console.error("Error combining images:", error)
      alert(`Failed to combine images: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const openDownloadModal = useCallback((url, defaultName) => {
    setCurrentDownloadUrl(url)
    setCurrentDownloadFileName(defaultName)
    setShowDownloadModal(true)
  }, []);

  const handMultipleDownlaod = useCallback(()=>{
    // console.log(combinedImages);
    combinedImages.forEach((file)=>{
         const url = file.url;
      const name = file.name;
     
      const link = document.createElement("a")
      link.download = `${name}.png`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    })
    

  })

  const handleDownloadConfirm = useCallback(() => {
    if (currentDownloadUrl && currentDownloadFileName) {
      const link = document.createElement("a")
      link.download = `${currentDownloadFileName}.png`
      link.href = currentDownloadUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setShowDownloadModal(false)
      setCurrentDownloadUrl("")
      setCurrentDownloadFileName("")
    } else {
      alert("No image selected for download or file name is missing.")
    }
  }, [currentDownloadUrl, currentDownloadFileName])

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-300 to-blue-100 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Image Combiner</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
       
        <div className="bg-white/70 backdrop-blur-sm p-6 shadow-lg rounded-lg max-h-[610px]">
          <div className="pb-4 mb-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Upload Images</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="main-photo-upload" className="block text-lg font-medium text-gray-700">
                Upload Main Photos (Multiple)
              </label>
              <input
                id="main-photo-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                onChange={handleMainPhotoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {mainPhotoFiles.length > 0 && (
                <div className="mt-4 flex gap-2 max-h-48 overflow-y-auto p-2 border border-white/50 rounded-md bg-gray-50">
                  {mainPhotoFiles.map((file, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Main Photo Preview ${index + 1}`}
                      className="max-h-24 object-contain rounded-md border border-gray-200 shadow-sm"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="logo-upload" className="block text-lg font-medium text-gray-700">
                Upload Logo (Single)
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleLogoChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {logoFile && (
                <div className="mt-2 flex">
                  <img
                    src={URL.createObjectURL(logoFile) || "/placeholder.svg"}
                    alt="Logo Preview"
                    className="max-h-24 object-contain rounded-md border border-gray-200 shadow-sm"
                  />
                </div>
              )}
            </div>

            <button
              onClick={combineAndGenerateImages}
              disabled={mainPhotoFiles.length === 0 || !logoFile || isGenerating}
              className="w-full py-3 px-4 text-[14px] rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isGenerating ? "Generating..." : "Combine Images"}
            </button>
          </div>
        </div>

        
        <div className="bg-white/70 backdrop-blur-sm p-6 shadow-lg rounded-lg">
          <div className="pb-4 mb-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Generated Images</h2>
            <button
               onClick={handMultipleDownlaod}
               disabled={combinedImages.length == 0|| mainPhotoFiles.length === 0 || !logoFile  ? true  : false}
              className=" py-3 px-4 text-[14px] rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
               Download All Images
            </button>
           
                 
          </div>
          <div className="space-y-4">
            {combinedImages.length === 0 && !isGenerating && (
              <p className="text-center text-gray-500">Upload images and click "Combine" to see results.</p>
            )}
            {isGenerating && (
              <div className="flex justify-center items-center h-48">
                <p className="text-gray-600">Combining images, please wait...</p>
              </div>
            )}
            <div className=" flex gap-4  flex-col overflow-y-auto p-2">
              {combinedImages.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-2 bg-white shadow-sm">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`Combined Image ${index + 1}`}
                    className="w-full h-auto object-contain mb-2 rounded-sm"
                  />
                  <p className="text-sm text-gray-700 truncate mb-2">{image.name}.png</p>
                  <button
                    onClick={() => openDownloadModal(image.url, image.name)}
                    className="w-full text-[14px] py-2 px-4 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-lg bg-white/90 backdrop-blur-sm p-6 shadow-xl">
            <div className="pb-4 mb-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Enter File Name</h3>
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="fileName" className="text-right text-gray-700">
                  File Name
                </label>
                <input
                  id="fileName"
                  type="text"
                  value={currentDownloadFileName}
                  onChange={(e) => setCurrentDownloadFileName(e.target.value)}
                  className="col-span-3 w-full border border-gray-300 rounded-md p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={handleDownloadConfirm}
                disabled={!currentDownloadFileName}
                className="py-2 px-4 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
              >
                Confirm  
              </button>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="py-2 px-4 rounded-md shadow-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
