/**
 * projects.js
 *
 * Fetches project data from the API and handles rendering,
 * searching, and modal interactions for the projects page.
 */

let projectsData = [];

document.addEventListener("DOMContentLoaded", async function () {
  if (document.getElementById("projectsGrid")) {
    await fetchProjects();
    const projectSearch = document.getElementById("projectSearch");
    if (projectSearch) {
      projectSearch.addEventListener("input", (e) =>
        renderProjects(e.target.value)
      );
    }
  }
});

async function fetchProjects() {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    projectsData = await response.json();
    renderProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    const container = document.getElementById("projectsGrid");
    if (container) {
      container.innerHTML =
        '<p class="error-message">Could not load projects. Please try again later.</p>';
    }
  }
}

function renderProjects(searchTerm = "") {
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  const filteredProjects = projectsData.filter(
    (project) =>
      project.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      project.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      (project.techStack &&
        project.techStack.some((tech) =>
          tech.toLowerCase().includes(lowerCaseSearchTerm)
        ))
  );

  const container = document.getElementById("projectsGrid");
  if (!container) return;

  if (filteredProjects.length === 0) {
    container.innerHTML = "<p>No projects found matching your search.</p>";
    return;
  }

  container.innerHTML = filteredProjects
    .map((project) => {
      const imageHtml = project.imageUrl
        ? `<img src="${project.imageUrl}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">`
        : `<i class="fas fa-code" style="font-size: 4rem; color: #ccc;"></i>`;

      return `
            <div class="project-card" onclick="openProjectModal('${
              project.id
            }')">
                <div class="project-image">
                    ${imageHtml}
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-tech">
                        ${project.techStack
                          .map(
                            (tech) => `<span class="tech-tag">${tech}</span>`
                          )
                          .join("")}
                    </div>
                    <div class="project-links">
                        <a href="${
                          project.github
                        }" class="project-link" title="GitHub" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>
                        <a href="${
                          project.linkedin
                        }" class="project-link" title="LinkedIn" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-linkedin"></i></a>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}

function openProjectModal(projectId) {
  const project = projectsData.find((p) => p.id === projectId);
  if (!project) {
    console.error("Project not found for ID:", projectId);
    return;
  }

  const modalContent = document.getElementById("projectModalContent");
  if (!modalContent) return;

  const modalImageHtml = project.imageUrl
    ? `<div class="modal-image-container">
               <img src="${project.imageUrl}" alt="${project.title}" style="max-width: 100%; border-radius: 8px;">
           </div>`
    : "";

  const techStackHtml =
    project.techStack && Array.isArray(project.techStack)
      ? project.techStack
          .map((tech) => `<span class="tech-tag">${tech}</span>`)
          .join("")
      : "";

  // --- END OF MODIFIED SECTION ---

  modalContent.innerHTML = `
        ${modalImageHtml}
        <h2>${project.title}</h2>
        <div class="project-tech" style="margin: 1rem 0;">
            ${techStackHtml}
        </div>
        <p style="margin-bottom: 2rem;">${
          project.description || "No full description available."
        }</p>
        <div class="project-links" style="justify-content: center; gap: 2rem;">
            <a href="${
              project.github
            }" class="project-link" style="font-size: 1.5rem;" title="GitHub" target="_blank"><i class="fab fa-github"></i> GitHub</a>
            <a href="${
              project.linkedin
            }" class="project-link" style="font-size: 1.5rem;" title="LinkedIn" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
        </div>
    `;

  const projectModal = document.getElementById("projectModal");
  if (projectModal) {
    projectModal.style.display = "block";
  }
}
