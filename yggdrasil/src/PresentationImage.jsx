import './PresentationImage.css'
import Me from './assets/images/Me.jpg';

function PresentationImage() {
  return (
    <>
      <div className='PresentationImage DivGlassmorphism'>
        <img src={Me} alt="Picture of myself" />
      </div>
    </>
  )
}

export default PresentationImage
