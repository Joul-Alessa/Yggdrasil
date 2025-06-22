import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useProfile } from './context/ProfileContext';
import './HomePage.css'
import PresentationSection from './PresentationSection.jsx';
import ChangeLanguageSection from './ChangeLanguageSection.jsx';
import IntroductionSection from './IntroductionSection.jsx';
import SectionHeader from './SectionHeader.jsx';
import ExperienceComponent from './ExperienceComponent.jsx';

function HomePage() {
  var { profile } = useParams();
  const { setProfile } = useProfile();
  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showStudies, setShowStudies] = useState(false);
  const [studies, setStudies] = useState([]);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const { i18n } = useTranslation();

  useEffect(() => {
    if (profile) {
      getProfile();

      // Limpiar la URL redirigiendo al home
      navigate('/', { replace: true }); // replace evita que vuelva atrás al parámetro
    }

    getJobs();
    getStudies();
  }, [profile, navigate]);

  useEffect(() => {
    const onLanguageChanged = (lng) => {
      if (profile) {
        getProfile();

        // Limpiar la URL redirigiendo al home
        navigate('/', { replace: true }); // replace evita que vuelva atrás al parámetro
      }

      getJobs();
      getStudies();
    };

    i18n.on('languageChanged', onLanguageChanged);

    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  });

  const getProfile = async () => {
    try
    {
      const res = await fetch(apiBaseUrl + '/api/ygg-profiles/' + profile + '?locale=' + i18n.language);

      if(res.status == 404)
      {
        profile = undefined;
      }
      setProfile(profile);
    } catch (error) {
      console.error(error);
    }
  };

  const getJobs = async () => {
    try
    {
      const res = await fetch(apiBaseUrl + '/api/ygg-jobs/?locale=' + i18n.language);
      const data = await res.json();
      
      if(data.data.length > 0)
      {
        setShowJobs(true);
        setJobs(data.data);
      }
      else
      {
        setShowJobs(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStudies = async () => {
    try
    {
      const res = await fetch(apiBaseUrl + '/api/ygg-studies/?locale=' + i18n.language);
      const data = await res.json();
      
      if(data.data.length > 0)
      {
        setShowStudies(true);
        setStudies(data.data);
      }
      else
      {
        setShowStudies(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const { t } = useTranslation();
  
  return (
    <>
      <div className='HomePageDiv'>
        <ChangeLanguageSection />
        <PresentationSection />
        <IntroductionSection />

        {showJobs && (
          <SectionHeader title={t('JobsTitle')} description={t('JobsDescription')}/>
        )}
        {jobs.map((exp, index) => (
          <ExperienceComponent
            text1={exp.workplace}
            text2={exp.initial_date}
            text3={exp.end_date}
            text4={exp.position}
            text5={exp.description}
            imageUrl={exp.logo.formats}/>
        ))}

        {showStudies && (
          <SectionHeader title={t('StudiesTitle')} description={t('StudiesDescription')}/>
        )}
        {studies.map((exp, index) => (
          <ExperienceComponent
            text1={exp.school}
            text2={exp.initial_date}
            text3={exp.end_date}
            text4={exp.study}
            text5={exp.description}
            imageUrl={exp.logo.formats}/>
        ))}
      </div>
    </>
  )
}

export default HomePage
