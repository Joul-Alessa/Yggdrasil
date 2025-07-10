import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useProfile } from './context/ProfileContext';
import './HomePage.css'
import PresentationSection from './PresentationSection.jsx';
import ChangeLanguageSection from './ChangeLanguageSection.jsx';
import IntroductionSection from './IntroductionSection.jsx';
import SectionHeader from './SectionHeader.jsx';
import ExperienceComponent from './ExperienceComponent.jsx';
import ProjectComponent from './ProjectComponent.jsx';
import TechnologyComponent from './TechnologyComponent.jsx';

function getPaginationRange(current, total, delta = 1)
{
  const range = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1); // Always show first

  if (left > 2) range.push('...');

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push('...');

  if (total > 1) range.push(total); // Always show last

  return range;
}

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    name: '',
    description: '',
    url: ''
  });
  var { profile } = useParams();
  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showStudies, setShowStudies] = useState(false);
  const [studies, setStudies] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showResources, setShowResources] = useState(false);
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectsPageSize] = useState(10);
  const [projectsTotalPages, setProjectsTotalPages] = useState(1);
  const [resourcesPage, setResourcesPage] = useState(1);
  const [resourcesPageSize] = useState(10);
  const [resourcesTotalPages, setResourcesTotalPages] = useState(1);

  // Evitar que se haga scroll cuando el modal está abierto
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);
  
  // Eventos para abrir y cerrar el modal
  const openModal = (name, description, url, technologies) => {
    setModalContent({
      name,
      description,
      url,
      technologies
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent('');
  };

  // Internacionalización
  const { i18n } = useTranslation();

  // Eventos de carga de información por idioma o por carga inicial de la página
  useEffect(() => {
    sessionStorage.setItem('randomSeed', Math.floor(Math.random() * 1001));
    if (profile) {
      getProfile();

      // Limpiar la URL redirigiendo al home
      navigate('/', { replace: true }); // replace evita que vuelva atrás al parámetro
    }

    getJobs();
    getStudies();
    getProjects();
    getResources();
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
      getProjects();
      getResources();
    };

    i18n.on('languageChanged', onLanguageChanged);

    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  });

  // Cambios en la paginación
  useEffect(() => {
    getResources();
  }, [resourcesPage, i18n.language]);

  // Obtener info del BackEnd
  const getProfile = async () => {
    try
    {
      if(sessionStorage.getItem('profile') == null)
      {
        const res = await fetch(apiBaseUrl + '/api/ygg-profiles/' + profile + '?locale=' + i18n.language);

        if(res.status == 404)
        {
          sessionStorage.setItem('profile', '');
        }
        else
        {
          sessionStorage.setItem('profile', profile);
        }
      }
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

  const getProjects = async () => {
    try
    {
      var profileParams = '';
      if(sessionStorage.getItem('profile') != null && sessionStorage.getItem('profile') != '')
      {
        profileParams = '&profile=' + sessionStorage.getItem('profile');
      }
      const res = await fetch(apiBaseUrl + '/api/ygg-projects?projectType=personal&page=' + resourcesPage + '&pageSize=' + resourcesPageSize + '&locale=' + i18n.language + profileParams);
      const data = await res.json();
      
      if(data.data.length > 0)
      {
        setShowProjects(true);
        setProjects(data.data);
        setProjectsTotalPages(data.meta.totalPages);
      }
      else
      {
        setShowProjects(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const getResources = async () => {
    try
    {
      var profileParams = '';
      if(sessionStorage.getItem('profile') != null && sessionStorage.getItem('profile') != '')
      {
        profileParams = '&profile=' + sessionStorage.getItem('profile');
      }
      const res = await fetch(apiBaseUrl + '/api/ygg-resources?randomSeed=' + sessionStorage.getItem('randomSeed') + '&page=' + resourcesPage + '&pageSize=' + resourcesPageSize + '&locale=' + i18n.language + profileParams);
      const data = await res.json();
      
      if(data.data.length > 0)
      {
        setShowResources(true);
        setResources(data.data);
        setResourcesTotalPages(data.meta.totalPages);
      }
      else
      {
        setShowResources(false);
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

        <SectionHeader title={t('ProductsTitle')} description={t('ProductsDescription')}/>

        {showProjects && (
          <>
            <SectionHeader title={t('ProjectsTitle')} description={t('ProjectsDescription')}/>
            <div className='ProjectsGrid'>
              {projects.map((exp, index) => (
                <ProjectComponent
                  urlLink={exp.url}
                  text1={exp.name}
                  text2={exp.review}
                  text3={exp.description}
                  technologies={exp.ygg_technologies}
                  imageUrl={exp.logo.formats}
                  onClick={() => openModal(exp.name, exp.description, exp.url, exp.ygg_technologies)}/>
              ))}
            </div>

            {projectsTotalPages > 1 && (
              <div className='PaginationControls'>
                <button
                  onClick={() => setProjectsPage((prev) => Math.max(prev - 1, 1))}
                  disabled={projectsPage === 1}
                >
                  {t('PaginationPrevious')}
                </button>

                {getPaginationRange(projectsPage, projectsTotalPages).map((item, index) =>
                  item === '...' ? (
                    <span key={index} className="PaginationEllipsis">…</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setProjectsPage(item)}
                      className={item === projectsPage ? 'active' : ''}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => setProjectsPage((prev) => Math.min(prev + 1, projectsTotalPages))}
                  disabled={projectsPage === projectsTotalPages}
                >
                  {t('PaginationNext')}
                </button>
              </div>
            )}
          </>
        )}

        <SectionHeader title={t('ContributionsTitle')} description={t('ContributionsDescription')}/>
        <SectionHeader title={t('CollaborationsTitle')} description={t('CollaborationsDescription')}/>
        <SectionHeader title={t('LearningProjectsTitle')} description={t('LearningProjectsDescription')}/>
        <SectionHeader title={t('KnowMeBetterProjectsTitle')} description={t('KnowMeBetterProjectsDescription')}/>

        {1 == 2 && (
          <SectionHeader title={t('FalseCVTitle')} description={t('FalseCVDescription')}/> // Quito de momento el Falso CV hasta que lo desarrolle mejor
        )}
        
        {showResources && (
          <>
            <SectionHeader title={t('RecommendedResourcesTitle')} description={t('RecommendedResourcesDescription')}/>
            <div className='ProjectsGrid'>
              {resources.map((exp, index) => (
                <ProjectComponent
                  urlLink={exp.url}
                  text1={exp.name}
                  text2={exp.review}
                  text3={exp.description}
                  technologies={exp.ygg_technologies}
                  imageUrl={exp.logo.formats}
                  onClick={() => openModal(exp.name, exp.description, exp.url, exp.ygg_technologies)}/>
              ))}
            </div>

            {resourcesTotalPages > 1 && (
              <div className='PaginationControls'>
                <button
                  onClick={() => setResourcesPage((prev) => Math.max(prev - 1, 1))}
                  disabled={resourcesPage === 1}
                >
                  {t('PaginationPrevious')}
                </button>

                {getPaginationRange(resourcesPage, resourcesTotalPages).map((item, index) =>
                  item === '...' ? (
                    <span key={index} className="PaginationEllipsis">…</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setResourcesPage(item)}
                      className={item === resourcesPage ? 'active' : ''}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => setResourcesPage((prev) => Math.min(prev + 1, resourcesTotalPages))}
                  disabled={resourcesPage === resourcesTotalPages}
                >
                  {t('PaginationNext')}
                </button>
              </div>
            )}
          </>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{modalContent.name}</h2>

              {modalContent.technologies && (
                <div className='TechnologyComponent'>
                  {modalContent.technologies.map((exp, index) => (
                    <TechnologyComponent
                    text={exp.name}
                    fontColor={exp.font_color}
                    backColor={exp.background_color}/>
                  ))}
                </div>
              )}

              {modalContent.url && (
                <p>
                  <a href={modalContent.url} target="_blank" rel="noopener noreferrer">
                    {modalContent.url}
                  </a>
                </p>
              )}
      
              <div className='modal-content-markdown'>
                <ReactMarkdown
                  components={{
                    img: ({node, ...props}) => {
                      const src = props.src?.startsWith('/uploads/')
                        ? apiBaseUrl + props.src
                        : props.src;

                      return <img {...props} src={src} />
                    }
                  }}
                >{modalContent.description}</ReactMarkdown>
              </div>
              <button onClick={closeModal}>{t('CloseModal')}</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage
