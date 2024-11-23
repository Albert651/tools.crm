import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import './Headers.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { useNotifications } from '../NotificationContext';
import logoAdmine from './R.png';

function Headers({ toggleSidebar }) {
  const [taches, setTaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { newTasks, markTaskAsViewed } = useNotifications();

  useEffect(() => {
    const fetchTaches = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/Taches');
        console.log('Données reçues:', response.data);
        setTaches(response.data);
        setError(null);
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaches();
  }, []);

  const handleTaskClick = async (tache) => {
    try {
      // Marquer la tâche comme vue
      await markTaskAsViewed(tache.id);
      
      // Ouvrir l'agenda dans un nouvel onglet si nécessaire
      if (tache.agenda) {
        window.open(tache.agenda, '_blank');
      }
    } catch (error) {
      console.error('Erreur lors du traitement de la tâche:', error);
    }
  };

  const renderTaskContent = () => {
    if (isLoading) {
      return <Dropdown.Item>Chargement...</Dropdown.Item>;
    }

    if (error) {
      return <Dropdown.Item className="text-danger">Erreur: {error}</Dropdown.Item>;
    }

    if (!taches || taches.length === 0) {
      return <Dropdown.Item>Aucune tâche à afficher</Dropdown.Item>;
    }

    return taches.map((tache, index) => (
      <Dropdown.Item 
        key={tache.id || index}
        as="div" 
        className="notification-item"
        onClick={() => handleTaskClick(tache)}
      >
        <h6><strong>Intitulé:</strong> <span className='text-success'>{tache.intitule}</span></h6>
        <p className="mb-1"><strong>Intervenant:</strong> <span className='text-success'>{tache.nom}</span> </p>
        <p className="mb-1"><strong>Date prévue:</strong> {tache.date_prevus}</p>
        <p className="mb-1">
          <strong>Agenda:</strong>{' '}
          <span className="cursor-pointer">
            {tache.lien_angenda}
          </span>
        </p>
        {index < taches.length - 1 && <hr className="my-2" />}
      </Dropdown.Item>
    ));
  };

  return (
    <header 
      className='header fixed-top d-flex align-items-center justify-content-between px-3' 
      id='header'
      style={{height: '10vh'}}
    >
      <div className="logo d-flex align-items-center" style={{gap: '1.5rem'}}>
        <a href="#" className="d-flex align-items-center text-decoration-none">
          <img 
            src={logoAdmine} 
            alt="Logo" 
            style={{width: 48, height: 36, borderRadius: '55%'}} 
          />
          <span className='text-dark ms-2'>Super Admin</span>
        </a>
        <i 
          className='bi bi-list toggle-sidebar-btn text-dark' 
          style={{cursor: 'pointer'}} 
          onClick={toggleSidebar}
        ></i> 
      </div>

      <nav className="header-nav">
        <ul className="list d-flex align-items-center m-0">
          <li className="nav-item p-3">
            <Dropdown>
              <Dropdown.Toggle 
                variant="dark" 
                id="notification-dropdown" 
                className="bg-transparent border-0 text-dark"
              >
                <i className="bi bi-bell" style={{ marginRight: 5, fontWeight: 700 }}></i>
                {newTasks.length > 0 && (
                  <span className="badge bg-danger badge-number">{newTasks.length}</span>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end" className="notifications p-0">
                <Dropdown.Header className="py-2 px-3 border-bottom">
                  Vous avez {newTasks.length} tâche(s) en retard
                </Dropdown.Header>
                {renderTaskContent()}
              </Dropdown.Menu>
            </Dropdown>
          </li>

          <li className="nav-item p-3">
            <Link 
              to='/' 
              className="nav-link text-decoration-none btn btn-danger d-flex align-items-center gap-2"
            >
              <FaSignOutAlt /> Déconnecter
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Headers;