import { useTranslation } from 'react-i18next';
import './App.css'
import PresentationSection from './PresentationSection.jsx';
import ChangeLanguageSection from './ChangeLanguageSection.jsx';
import IntroductionSection from './IntroductionSection.jsx';
import SectionHeader from './SectionHeader.jsx';

function App() {
  const { t } = useTranslation();
  
  return (
    <>
      <div className='AppDiv'>
        <ChangeLanguageSection />
        <PresentationSection />
        <IntroductionSection />
        <SectionHeader title={t('ProfessionalExperienceTitle')} description={t('ProfessionalExperienceDescription')}/>
      </div>
    </>
  )
}

export default App
