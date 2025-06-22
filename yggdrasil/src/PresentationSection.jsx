import './PresentationSection.css'
import PresentationName from './PresentationName.jsx';
import PresentationBio from './PresentationBio.jsx';
import PresentationImage from './PresentationImage.jsx';

function PresentationSection() {
  return (
    <>
      <div className='PresentationSection'>
        <PresentationName />
        <PresentationBio />
        <PresentationImage />
      </div>
    </>
  )
}

export default PresentationSection
