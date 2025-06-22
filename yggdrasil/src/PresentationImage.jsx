import './PresentationImage.css'
import Me from './assets/images/Me.jpg';

function PresentationImage() {
  return (
    <>
      <div className='PresentationImage DivGlassmorphism'>
        <img src={Me} className="logo" alt="Vite logo" />
      </div>
    </>
  )
}

export default PresentationImage
