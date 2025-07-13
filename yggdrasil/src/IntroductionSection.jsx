import { useTranslation } from 'react-i18next';
import './IntroductionSection.css'

function IntroductionSection() {
  const { t } = useTranslation();
  
  return (
    <>
      <div className='IntroductionSection DivGlassmorphism'>
        <div className='VerticalCenterer'>
          <p className="IntroductionText1">{t('IntroductionText1')}</p>

          <p className="IntroductionText2">{t('IntroductionText2')}</p>

          <p className="IntroductionText3">{t('IntroductionText3')}</p>
        </div>
      </div>
    </>
  )
}

export default IntroductionSection
