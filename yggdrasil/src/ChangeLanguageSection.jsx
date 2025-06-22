import { useTranslation } from 'react-i18next';
import './ChangeLanguageSection.css'

function ChangeLanguageSection() {
  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };
  
  return (
    <>
      <div className='ChangeLanguageSection DivGlassmorphism'>
        <div className='VerticalCenterer'>
          <p>{t('ChangeLanguageText')}</p>

          <select onChange={handleChange} value={i18n.language} name='ChangeLanguage'>
            <option value='es-419'>{t('ChangeLanguageSpanish')}</option>
            <option value='en'>{t('ChangeLanguageEnglish')}</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default ChangeLanguageSection
