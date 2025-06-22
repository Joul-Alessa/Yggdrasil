import { useTranslation } from 'react-i18next';
import './SectionHeader.css'

function SectionHeader({ title, description }) {
  const { t } = useTranslation();
  
  return (
    <>
      <div className='SectionHeader DivGlassmorphism'>
        <div className='VerticalCenterer'>
          <p className="SectionHeaderTitle">{title}</p>

          <p className="SectionHeaderDescription">{description}</p>
        </div>
      </div>
    </>
  )
}

export default SectionHeader
