 

import NavBar from "../NavBar"

 

function mainLayout({children}) {
  return (
  <div className=''>
     <NavBar />
      <div>
        {children}
      </div>
      
  </div>
  )
}

export default mainLayout