import './App.css'
import PresentationSection from './PresentationSection.jsx';
import ChangeLanguageSection from './ChangeLanguageSection.jsx';

function App() {
  return (
    <>
      <div className='AppDiv'>
        <ChangeLanguageSection />
        <PresentationSection />
      </div>
    </>
  )
}

export default App
