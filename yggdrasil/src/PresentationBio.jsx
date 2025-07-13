import { useTranslation } from 'react-i18next';
import './PresentationBio.css'

function PresentationBio() {
  const { t } = useTranslation();
  
  return (
    <>
      <div className='PresentationBio DivGlassmorphism'>
        <div className='VerticalCenterer'>
          <p>{t('PresentationBioText1')}</p>

          <p>{t('PresentationBioText2')}</p>

          <p>{t('PresentationBioText3')}</p>
        </div>
      </div>
    </>
  )
}

export default PresentationBio
