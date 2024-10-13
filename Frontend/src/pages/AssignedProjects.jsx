import React, { useState, useEffect } from 'react';
import { fetchAssignedProjects } from '../api/projects'; // Assuming this API call exists

const AssignedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5); // Display 5 projects per page

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const response = await fetchAssignedProjects();
                if (response && response.length) {
                    setProjects(response); // Set the first project as the selected one, ensure projects[0] exists
                  } else {
                    setError(error.message || 'You are currently not a part of any project.');
                  }
            } catch (error) {
                setError('Failed to fetch projects. Please try again.');
            }
            setIsLoading(false);
        };

        fetchProjects();
    }, []);

    // Get current projects
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mt-3 d-flex flex-column justify-content-center" style={{ minHeight: "100vh" }}>
            {isLoading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                    <div className="alert alert-danger text-center" style={{ width: "50%" }}>
                        {error}
                    </div>
                </div>
            ) : (<div style={{ maxWidth: "30%" }}>
                    <h2 className="text-center">My Projects</h2>
                    {currentProjects.map(project => (
                        <div className="card mb-3" key={project.id}>
                            <div className="card-body">
                                <h5 className="card-title">{project.name}</h5>
                                <p className="card-text">{project.description}</p>
                                <p className="card-text"><small className="text-muted">Status: {project.status}</small></p>
                            </div>
                        </div>
                    ))}
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: Math.ceil(projects.length / projectsPerPage) }, (_, index) => (
                                <li key={index + 1} className="page-item">
                                    <a onClick={() => paginate(index + 1)} className="page-link" href="#">
                                        {index + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>)
            }
        </div>
    );
}

export default AssignedProjects;