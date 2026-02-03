import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  var profile = queryParams.get("profile");
  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showStudies, setShowStudies] = useState(false);
  const [studies, setStudies] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showContributions, setShowContributions] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [showCollaborations, setShowCollaborations] = useState(false);
  const [collaborations, setCollaborations] = useState([]);
  const [showLearningProjects, setShowLearningProjects] = useState(false);
  const [learningProjects, setLearningProjects] = useState([]);
  const [showKnowMeBetterProjects, setShowKnowMeBetterProjects] = useState(false);
  const [knowMeBetterProjects, setKnowMeBetterProjects] = useState([]);
  const [showResources, setShowResources] = useState(false);
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const [productsPage, setProductsPage] = useState(1);
  const [productsPageSize] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectsPageSize] = useState(10);
  const [projectsTotalPages, setProjectsTotalPages] = useState(1);
  const [contributionsPage, setContributionsPage] = useState(1);
  const [contributionsPageSize] = useState(10);
  const [contributionsTotalPages, setContributionsTotalPages] = useState(1);
  const [collaborationsPage, setCollaborationsPage] = useState(1);
  const [collaborationsPageSize] = useState(10);
  const [collaborationsTotalPages, setCollaborationsTotalPages] = useState(1);
  const [learningProjectsPage, setLearningProjectsPage] = useState(1);
  const [learningProjectsPageSize] = useState(10);
  const [learningProjectsTotalPages, setLearningProjectsTotalPages] = useState(1);
  const [knowMeBetterProjectsPage, setKnowMeBetterProjectsPage] = useState(1);
  const [knowMeBetterProjectsPageSize] = useState(10);
  const [knowMeBetterProjectsTotalPages, setKnowMeBetterProjectsTotalPages] = useState(1);
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
    const fetchData = async () => {
      sessionStorage.setItem('randomSeed', Math.floor(Math.random() * 1001));
      
      if (profile) {
        await getProfile(); // Esperar validación del perfil
      }

      // Solo después de validar el perfil, se hacen estas llamadas
      await Promise.all([
        getJobs(),
        getStudies(),
        getProducts(),
        getProjects(),
        getContributions(),
        getCollaborations(),
        getLearningProjects(),
        getKnowMeBetterProjects(),
        getResources()
      ]);
    };

    // Ejecutar la función async
    fetchData();
  }, [profile, navigate]);

  useEffect(() => {
    const onLanguageChanged = (lng) => {
      if (profile) {
        getProfile();
      }

      getJobs();
      getStudies();
      getProducts();
      getProjects();
      getContributions();
      getCollaborations();
      getLearningProjects();
      getKnowMeBetterProjects();
      getResources();
    };

    i18n.on('languageChanged', onLanguageChanged);

    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  });

  // Cambios en la paginación
  useEffect(() => {
    getProducts();
  }, [productsPage, i18n.language]);

  useEffect(() => {
    getProjects();
  }, [projectsPage, i18n.language]);

  useEffect(() => {
    getContributions();
  }, [contributionsPage, i18n.language]);

  useEffect(() => {
    getCollaborations();
  }, [collaborationsPage, i18n.language]);

  useEffect(() => {
    getLearningProjects();
  }, [learningProjectsPage, i18n.language]);

  useEffect(() => {
    getKnowMeBetterProjects();
  }, [knowMeBetterProjectsPage, i18n.language]);

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

  const getProducts = async () => {
    try
    {
      var profileParams = '';
      if(sessionStorage.getItem('profile') != null && sessionStorage.getItem('profile') != '')
      {
        profileParams = '&profile=' + sessionStorage.getItem('profile');
      }
      const res = await fetch(apiBaseUrl + '/api/ygg-projects?projectType=product&page=' + productsPage + '&pageSize=' + productsPageSize + '&locale=' + i18n.language + profileParams);
      const data = await res.json();
      
      if(data.data.length > 0)
      {
        setShowProducts(true);
        setProducts(data.data);
        setProductsTotalPages(data.meta.totalPages);
      }
      else
      {
        setShowProducts(false);
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
      const res = await fetch(apiBaseUrl + '/api/ygg-projects?projectType=notKnowMe&page=' + projectsPage + '&pageSize=' + projectsPageSize + '&locale=' + i18n.language + profileParams);
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

  const getContributions = async () => {
    try
    {
      var profileParams = '';
      if(sessionStorage.getItem('profile') != null && sessionStorage.getItem('profile') != '')
      {
        profileParams = '&profile=' + sessionStorage.getItem('profile');
      }
      const res = await fetch(apiBaseUrl + '/api/ygg-projects?projectType=contribution&page=' + contributionsPage + '&pageSize=' + contributionsPageSize + '&locale=' + i18n.language + profileParams);
      const data = await res.json();
      
      if(data.data.length > 0)
      {
        setShowContributions(true);
        setContributions(data.data);
        setContributionsTotalPages(data.meta.totalPages);
      }
      else
      {
        setShowContributions(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCollaborations = async () => {
    try
    {
      var profileParams = '';
      if(sessionStorage.getItem('profile') != null && sessionStorage.getItem('profile') != '')
      {
        profileParams = '&profile=' + sessionStorage.getItem('profile');
      }
      const res = await fetch(apiBaseUrl + '/api/ygg-projects?projectType=collaboration&page=' + collaborationsPage + '&pageSize=' + collaborationsPageSize + '&locale=' + i18n.language + profileParams);
      const data = await res.json();
      
      if(data.data.length > 0)
      {
        setShowCollaborations(true);
        setCollaborations(data.data);
        setCollaborationsTotalPages(data.meta.totalPages);
      }
      else
      {
        setShowCollaborations(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getLearningProjects = async () => {
    try
    {
      var profileParams = '';
      if(sessionStorage.getItem('profile') != null && sessionStorage.getItem('profile') != '')
      {
        profileParams = '&profile=' + sessionStorage.getItem('profile');
      }
      const res = await fetch(apiBaseUrl + '/api/ygg-projects?projectType=learning&page=' + learningProjectsPage + '&pageSize=' + learningProjectsPageSize + '&locale=' + i18n.language + profileParams);
      const data = await res.json();
      
      if(data.data.length > 0)
      {
        setShowLearningProjects(true);
        setLearningProjects(data.data);
        setLearningProjectsTotalPages(data.meta.totalPages);
      }
      else
      {
        setShowLearningProjects(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getKnowMeBetterProjects = async () => {
    try
    {
      var profileParams = '';
      if(sessionStorage.getItem('profile') != null && sessionStorage.getItem('profile') != '')
      {
        profileParams = '&profile=' + sessionStorage.getItem('profile');
      }
      const res = await fetch(apiBaseUrl + '/api/ygg-projects?projectType=knowMe&page=' + knowMeBetterProjectsPage + '&pageSize=' + knowMeBetterProjectsPageSize + '&locale=' + i18n.language + profileParams);
      const data = await res.json();
      
      if(data.data.length > 0)
      {
        setShowKnowMeBetterProjects(true);
        setKnowMeBetterProjects(data.data);
        setKnowMeBetterProjectsTotalPages(data.meta.totalPages);
      }
      else
      {
        setShowKnowMeBetterProjects(false);
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

        {showProducts && (
          <>
            <SectionHeader title={t('ProductsTitle')} description={t('ProductsDescription')}/>
            <div className='ProjectsGrid'>
              {products.map((exp, index) => (
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

            {productsTotalPages > 1 && (
              <div className='PaginationControls'>
                <button
                  onClick={() => setProductsPage((prev) => Math.max(prev - 1, 1))}
                  disabled={productsPage === 1}
                >
                  {t('PaginationPrevious')}
                </button>

                {getPaginationRange(productsPage, productsTotalPages).map((item, index) =>
                  item === '...' ? (
                    <span key={index} className="PaginationEllipsis">…</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setProductsPage(item)}
                      className={item === productsPage ? 'active' : ''}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => setProductsPage((prev) => Math.min(prev + 1, productsTotalPages))}
                  disabled={productsPage === productsTotalPages}
                >
                  {t('PaginationNext')}
                </button>
              </div>
            )}
          </>
        )}

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

        {showContributions && (
          <>
            <SectionHeader title={t('ContributionsTitle')} description={t('ContributionsDescription')}/>
            <div className='ProjectsGrid'>
              {contributions.map((exp, index) => (
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

            {contributionsTotalPages > 1 && (
              <div className='PaginationControls'>
                <button
                  onClick={() => setContributionsPage((prev) => Math.max(prev - 1, 1))}
                  disabled={contributionsPage === 1}
                >
                  {t('PaginationPrevious')}
                </button>

                {getPaginationRange(contributionsPage, contributionsTotalPages).map((item, index) =>
                  item === '...' ? (
                    <span key={index} className="PaginationEllipsis">…</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setContributionsPage(item)}
                      className={item === contributionsPage ? 'active' : ''}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => setContributionsPage((prev) => Math.min(prev + 1, contributionsTotalPages))}
                  disabled={contributionsPage === contributionsTotalPages}
                >
                  {t('PaginationNext')}
                </button>
              </div>
            )}
          </>
        )}

        {showCollaborations && (
          <>
            <SectionHeader title={t('CollaborationsTitle')} description={t('CollaborationsDescription')}/>
            <div className='ProjectsGrid'>
              {collaborations.map((exp, index) => (
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

            {collaborationsTotalPages > 1 && (
              <div className='PaginationControls'>
                <button
                  onClick={() => setCollaborationsPage((prev) => Math.max(prev - 1, 1))}
                  disabled={collaborationsPage === 1}
                >
                  {t('PaginationPrevious')}
                </button>

                {getPaginationRange(collaborationsPage, collaborationsTotalPages).map((item, index) =>
                  item === '...' ? (
                    <span key={index} className="PaginationEllipsis">…</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setCollaborationsPage(item)}
                      className={item === collaborationsPage ? 'active' : ''}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => setCollaborationsPage((prev) => Math.min(prev + 1, collaborationsTotalPages))}
                  disabled={collaborationsPage === collaborationsTotalPages}
                >
                  {t('PaginationNext')}
                </button>
              </div>
            )}
          </>
        )}

        {showLearningProjects && (
          <>
            <SectionHeader title={t('LearningProjectsTitle')} description={t('LearningProjectsDescription')}/>
            <div className='ProjectsGrid'>
              {learningProjects.map((exp, index) => (
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

            {learningProjectsTotalPages > 1 && (
              <div className='PaginationControls'>
                <button
                  onClick={() => setLearningProjectsPage((prev) => Math.max(prev - 1, 1))}
                  disabled={learningProjectsPage === 1}
                >
                  {t('PaginationPrevious')}
                </button>

                {getPaginationRange(learningProjectsPage, learningProjectsTotalPages).map((item, index) =>
                  item === '...' ? (
                    <span key={index} className="PaginationEllipsis">…</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setLearningProjectsPage(item)}
                      className={item === learningProjectsPage ? 'active' : ''}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => setLearningProjectsPage((prev) => Math.min(prev + 1, learningProjectsTotalPages))}
                  disabled={learningProjectsPage === learningProjectsTotalPages}
                >
                  {t('PaginationNext')}
                </button>
              </div>
            )}
          </>
        )}

        {showKnowMeBetterProjects && (
          <>
            <SectionHeader title={t('KnowMeBetterProjectsTitle')} description={t('KnowMeBetterProjectsDescription')}/>
            <div className='ProjectsGrid'>
              {knowMeBetterProjects.map((exp, index) => (
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

            {knowMeBetterProjectsTotalPages > 1 && (
              <div className='PaginationControls'>
                <button
                  onClick={() => setKnowMeBetterProjectsPage((prev) => Math.max(prev - 1, 1))}
                  disabled={knowMeBetterProjectsPage === 1}
                >
                  {t('PaginationPrevious')}
                </button>

                {getPaginationRange(knowMeBetterProjectsPage, knowMeBetterProjectsTotalPages).map((item, index) =>
                  item === '...' ? (
                    <span key={index} className="PaginationEllipsis">…</span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => setKnowMeBetterProjectsPage(item)}
                      className={item === knowMeBetterProjectsPage ? 'active' : ''}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  onClick={() => setKnowMeBetterProjectsPage((prev) => Math.min(prev + 1, knowMeBetterProjectsTotalPages))}
                  disabled={knowMeBetterProjectsPage === knowMeBetterProjectsTotalPages}
                >
                  {t('PaginationNext')}
                </button>
              </div>
            )}
          </>
        )}

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
              
              <div className="modal-body">
                <button className="close-modal-button" onClick={closeModal}>
                  {t('CloseModal')}
                </button>
              </div>

              <div className="modal-body">
                <h2>{modalContent.name}</h2>

                {modalContent.technologies && (
                  <div className='TechnologyComponent' style={{ justifyContent: 'center' }}>
                    {modalContent.technologies.map((exp, index) => (
                      <TechnologyComponent
                        key={index}
                        text={exp.name}
                        fontColor={exp.font_color}
                        backColor={exp.background_color}
                      />
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
                      img: ({ node, ...props }) => {
                        const src = props.src?.startsWith('/uploads/')
                          ? apiBaseUrl + props.src
                          : props.src;
                        return <img {...props} src={src} />;
                      }
                    }}
                  >
                    {modalContent.description}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default HomePage
