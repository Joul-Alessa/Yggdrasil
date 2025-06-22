import './App.css'
import PresentationSection from './PresentationSection.jsx';
import ChangeLanguageSection from './ChangeLanguageSection.jsx';
import IntroductionSection from './IntroductionSection.jsx';

function App() {
  return (
    <>
      <div className='AppDiv'>
        <ChangeLanguageSection />
        <PresentationSection />
        <IntroductionSection />
      </div>
    </>
  )
}

export default App
