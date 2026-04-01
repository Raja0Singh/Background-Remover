document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    
    // Sections
    const uploadSection = document.getElementById('upload-section');
    const processingSection = document.getElementById('processing-section');
    const resultSection = document.getElementById('result-section');
    
    // Image Elements
    const originalImage = document.getElementById('original-image');
    const processedImage = document.getElementById('processed-image');
    
    // Buttons
    const resetBtn = document.getElementById('reset-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    // Toast
    const errorToast = document.getElementById('error-toast');
    const errorMessage = document.getElementById('error-message');

    let currentFile = null;
    let processedBlobUrl = null;

    // --- Drag and Drop Events ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-active');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-active');
        }, false);
    });

    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            handleFiles(files[0]);
        }
    }

    // --- Browse Button Event ---
    browseBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFiles(this.files[0]);
        }
    });

    // --- Core Logic ---
    function handleFiles(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError("Please upload a valid image file (JPG, PNG).");
            return;
        }
        
        // Size validation (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showError("File size is too large. Maximum size is 5MB.");
            return;
        }

        currentFile = file;
        
        // Show Original Image
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            originalImage.src = reader.result;
            
            // Switch to Processing State
            transitionSection(uploadSection, processingSection);
            
            // Call API
            processImage(file);
        }
    }

    async function processImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Send to our Python FastAPI Backend
            const response = await fetch('http://localhost:8000/remove-bg', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Server error - Failed to process image.");
            }

            // Get processed image as blob
            const blob = await response.blob();
            
            // Cleanup previous blob URL if exists
            if (processedBlobUrl) {
                URL.revokeObjectURL(processedBlobUrl);
            }
            
            processedBlobUrl = URL.createObjectURL(blob);
            processedImage.src = processedBlobUrl;
            
            // Transition to Result
            transitionSection(processingSection, resultSection);

        } catch (error) {
            console.error(error);
            showError("Failed to remove background. Make sure the server is running.");
            // Return to upload screen
            transitionSection(processingSection, uploadSection);
        }
    }

    // --- Button Actions ---
    resetBtn.addEventListener('click', () => {
        // Reset state
        fileInput.value = '';
        currentFile = null;
        if (processedBlobUrl) {
            URL.revokeObjectURL(processedBlobUrl);
            processedBlobUrl = null;
        }
        
        transitionSection(resultSection, uploadSection);
    });

    downloadBtn.addEventListener('click', () => {
        if (!processedBlobUrl) return;
        
        const a = document.createElement('a');
        a.href = processedBlobUrl;
        
        // Create a cool filename
        const originalName = currentFile ? currentFile.name.split('.')[0] : 'image';
        a.download = `${originalName}-bg-removed.png`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // --- Utilities ---
    function transitionSection(hideSec, showSec) {
        hideSec.classList.add('hidden');
        showSec.classList.remove('hidden');
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorToast.classList.remove('hidden');
        
        // Animate out after 4 seconds
        setTimeout(() => {
            errorToast.classList.add('hidden');
        }, 4000);
    }
});
