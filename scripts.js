// Assume you have a global variable to track the current project and files
let currentProjectName = 'default'; // Replace with your actual logic to manage projects
let projects = {
  'default': {
    files: {
      'index.html': '<html>\n<head>\n<title>My Website</title>\n</head>\n<body>\n<h1>Hello, World!</h1>\n</body>\n</html>',
      'styles.css': 'body {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n}\n\nh1 {\n  color: #333;\n}'
    }
  }
};

function newProject() {
  const projectName = prompt('Enter a name for the new project:');
  if (projectName && !projects.hasOwnProperty(projectName)) {
    projects[projectName] = { files: {} }; // Initialize with an empty files object
    saveProjects();
    updateProjectList();
  } else {
    alert('Please enter a valid project name.');
  }
}

function updateProjectList() {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = Object.keys(projects).map(projectName => {
    return `<div><input type="radio" name="project" value="${projectName}"> ${projectName}</div>`;
  }).join('');
}

function goToEditor() {
  const selectedProject = document.querySelector('input[name="project"]:checked');
  if (selectedProject) {
    const projectName = selectedProject.value;
    window.location.href = `editor.html?project=${encodeURIComponent(projectName)}`;
  } else {
    alert('Please select a project.');
  }
}

function newFile() {
  const fileName = prompt('Enter a name for the new file (including extension):');
  if (fileName && !projects[currentProjectName].files.hasOwnProperty(fileName)) {
    projects[currentProjectName].files[fileName] = ''; // Initialize with empty content
    saveProjects();
    updateFileTabs();
    openFile(fileName); // Optional: Automatically open the newly created file
  } else {
    alert('Please enter a valid file name.');
  }
}

function updateFileTabs() {
  const fileTabs = document.getElementById('file-tabs');
  fileTabs.innerHTML = Object.keys(projects[currentProjectName].files).map(fileName => {
    return `<div class="file-tab" onclick="openFile('${fileName}')">${fileName}</div>`;
  }).join('');
}

function openFile(fileName) {
  if (currentProjectName) {
    currentFile = fileName;
    const editor = document.getElementById('editor');
    editor.value = projects[currentProjectName].files[fileName];
    updateFileTabs();
  }
}

function saveProject() {
  if (currentProjectName) {
    const editor = document.getElementById('editor');
    projects[currentProjectName].files[currentFile] = editor.value;
    saveProjects();
    updateFileTabs();
  }
}

function deleteFile() {
  const fileName = currentFile;
  if (currentProjectName && fileName && confirm(`Are you sure you want to delete '${fileName}'?`)) {
    delete projects[currentProjectName].files[fileName];
    saveProjects();
    updateFileTabs();
    const editor = document.getElementById('editor');
    editor.value = ''; // Clear editor after deletion
  }
}

function uploadFile(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const fileName = file.name;
      const fileContent = e.target.result;
      projects[currentProjectName].files[fileName] = fileContent;
      saveProjects();
      updateFileTabs();
      openFile(fileName); // Optional: Automatically open the uploaded file
    };
    reader.readAsText(file);
  }
}

function exportToZip() {
  const zip = new JSZip();
  const projectFiles = projects[currentProjectName].files;
  for (let fileName in projectFiles) {
    zip.file(fileName, projectFiles[fileName]);
  }
  zip.generateAsync({ type: 'blob' })
    .then(function(content) {
      saveAs(content, `${currentProjectName}.zip`);
    });
}

function runProject() {
  const htmlContent = projects[currentProjectName].files['index.html'];
  const previewWindow = window.open();
  previewWindow.document.write(htmlContent);
  previewWindow.document.close();
}

// Function to save projects to local storage
function saveProjects() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

// Function to load projects from local storage
function loadProjects() {
  const storedProjects = localStorage.getItem('projects');
  if (storedProjects) {
    projects = JSON.parse(storedProjects);
    updateFileTabs(); // Update file tabs after loading projects
  }
}

// Example initial call to load projects on page load
window.onload = function() {
  loadProjects();
};
function exportToZip() {
  const zip = new JSZip();
  const projectFiles = projects[currentProjectName].files;

  for (let fileName in projectFiles) {
    zip.file(fileName, projectFiles[fileName]);
  }

  zip.generateAsync({ type: 'blob' }).then(function(content) {
    saveAs(content, `${currentProjectName}.zip`);
  });
}