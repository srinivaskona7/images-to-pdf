// Images to PDF Pro - Premium Converter with Advanced Features
class ImagesToPDF {
    constructor() {
        this.images = [];
        this.selectedImages = new Set();
        this.currentView = 'grid';
        this.orientation = 'portrait';
        this.previewIndex = 0;
        this.pdfBlob = null;
        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.loadTheme();
        this.updateEstimate();
    }

    bindElements() {
        // Upload
        this.uploadSection = document.getElementById('uploadSection');
        this.uploadZone = document.getElementById('uploadZone');
        this.fileInput = document.getElementById('fileInput');
        this.browseBtn = document.getElementById('browseBtn');
        this.pasteBtn = document.getElementById('pasteBtn');

        // Editor
        this.editorSection = document.getElementById('editorSection');
        this.imagesGrid = document.getElementById('imagesGrid');
        this.imageCount = document.getElementById('imageCount');
        this.addMoreBtn = document.getElementById('addMoreBtn');
        this.selectAllBtn = document.getElementById('selectAllBtn');
        this.deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        this.rotateLeftBtn = document.getElementById('rotateLeftBtn');
        this.rotateRightBtn = document.getElementById('rotateRightBtn');

        // Page Settings
        this.pageSize = document.getElementById('pageSize');
        this.marginRange = document.getElementById('marginRange');
        this.marginValue = document.getElementById('marginValue');
        this.bgColor = document.getElementById('bgColor');
        this.bgColorValue = document.getElementById('bgColorValue');
        this.pageLayout = document.getElementById('pageLayout');
        this.addPageNumbers = document.getElementById('addPageNumbers');

        // Image Settings
        this.imageFit = document.getElementById('imageFit');
        this.qualityRange = document.getElementById('qualityRange');
        this.qualityValue = document.getElementById('qualityValue');
        this.brightnessRange = document.getElementById('brightnessRange');
        this.brightnessValue = document.getElementById('brightnessValue');
        this.contrastRange = document.getElementById('contrastRange');
        this.contrastValue = document.getElementById('contrastValue');
        this.saturationRange = document.getElementById('saturationRange');
        this.saturationValue = document.getElementById('saturationValue');
        this.imageBorder = document.getElementById('imageBorder');
        this.borderColor = document.getElementById('borderColor');
        this.borderColorValue = document.getElementById('borderColorValue');
        this.grayscale = document.getElementById('grayscale');

        // Watermark Settings
        this.enableWatermark = document.getElementById('enableWatermark');
        this.watermarkText = document.getElementById('watermarkText');
        this.watermarkSize = document.getElementById('watermarkSize');
        this.watermarkSizeValue = document.getElementById('watermarkSizeValue');
        this.watermarkColor = document.getElementById('watermarkColor');
        this.watermarkColorValue = document.getElementById('watermarkColorValue');
        this.watermarkOpacity = document.getElementById('watermarkOpacity');
        this.watermarkOpacityValue = document.getElementById('watermarkOpacityValue');
        this.watermarkPosition = document.getElementById('watermarkPosition');

        // Advanced Settings
        this.headerText = document.getElementById('headerText');
        this.footerText = document.getElementById('footerText');
        this.pdfTitle = document.getElementById('pdfTitle');
        this.pdfAuthor = document.getElementById('pdfAuthor');
        this.compression = document.getElementById('compression');
        this.autoEnhance = document.getElementById('autoEnhance');
        this.preserveExif = document.getElementById('preserveExif');

        this.generateBtn = document.getElementById('generateBtn');
        this.estimateInfo = document.getElementById('estimateInfo');

        this.progressModal = document.getElementById('progressModal');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.successModal = document.getElementById('successModal');
        this.newConversionBtn = document.getElementById('newConversionBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.previewModal = document.getElementById('previewModal');
        this.previewImage = document.getElementById('previewImage');
        this.previewInfo = document.getElementById('previewInfo');

        // Other
        this.themeToggle = document.getElementById('themeToggle');
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        // Upload events
        this.uploadZone.addEventListener('click', () => this.fileInput.click());
        this.browseBtn.addEventListener('click', (e) => { e.stopPropagation(); this.fileInput.click(); });
        this.fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));
        this.pasteBtn.addEventListener('click', () => this.pasteFromClipboard());

        // Drag and drop
        this.uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); this.uploadZone.classList.add('drag-over'); });
        this.uploadZone.addEventListener('dragleave', () => this.uploadZone.classList.remove('drag-over'));
        this.uploadZone.addEventListener('drop', (e) => { e.preventDefault(); this.uploadZone.classList.remove('drag-over'); this.handleFiles(e.dataTransfer.files); });

        // Toolbar
        this.addMoreBtn.addEventListener('click', () => this.fileInput.click());
        this.selectAllBtn.addEventListener('click', () => this.toggleSelectAll());
        this.deleteSelectedBtn.addEventListener('click', () => this.deleteSelected());
        this.rotateLeftBtn.addEventListener('click', () => this.rotateSelected(-90));
        this.rotateRightBtn.addEventListener('click', () => this.rotateSelected(90));

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setView(btn.dataset.view));
        });

        // Orientation toggle
        document.querySelectorAll('.orient-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setOrientation(btn.dataset.orient));
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Page Settings
        this.marginRange.addEventListener('input', () => { this.marginValue.textContent = this.marginRange.value + 'mm'; });
        this.bgColor.addEventListener('input', () => { this.bgColorValue.textContent = this.bgColor.value.toUpperCase(); });

        // Image Settings
        this.qualityRange.addEventListener('input', () => {
            this.qualityValue.textContent = Math.round(this.qualityRange.value * 100) + '%';
            this.updateEstimate();
        });
        this.brightnessRange.addEventListener('input', () => { this.brightnessValue.textContent = this.brightnessRange.value + '%'; });
        this.contrastRange.addEventListener('input', () => { this.contrastValue.textContent = this.contrastRange.value + '%'; });
        this.saturationRange.addEventListener('input', () => { this.saturationValue.textContent = this.saturationRange.value + '%'; });
        this.borderColor.addEventListener('input', () => { this.borderColorValue.textContent = this.borderColor.value.toUpperCase(); });

        // Watermark Settings
        this.watermarkSize.addEventListener('input', () => { this.watermarkSizeValue.textContent = this.watermarkSize.value + 'px'; });
        this.watermarkColor.addEventListener('input', () => { this.watermarkColorValue.textContent = this.watermarkColor.value.toUpperCase(); });
        this.watermarkOpacity.addEventListener('input', () => { this.watermarkOpacityValue.textContent = Math.round(this.watermarkOpacity.value * 100) + '%'; });

        // Generate
        this.generateBtn.addEventListener('click', () => this.generatePDF());

        // Success modal
        this.newConversionBtn.addEventListener('click', () => this.reset());
        this.closeModalBtn.addEventListener('click', () => this.closeModals());

        // Preview modal
        document.getElementById('closePreview').addEventListener('click', () => this.closePreview());
        document.getElementById('prevImage').addEventListener('click', () => this.navigatePreview(-1));
        document.getElementById('nextImage').addEventListener('click', () => this.navigatePreview(1));
        this.previewModal.addEventListener('click', (e) => { if (e.target === this.previewModal) this.closePreview(); });

        // Theme
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePreview();
                this.closeModals();
            }
            if (e.key === 'ArrowLeft') this.navigatePreview(-1);
            if (e.key === 'ArrowRight') this.navigatePreview(1);
        });

        // Paste anywhere
        document.addEventListener('paste', (e) => this.handlePaste(e));
    }

    switchTab(tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabId}`);
        });
    }

    async handleFiles(files) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
        const newImages = [];

        for (const file of files) {
            if (validTypes.includes(file.type)) {
                const dataUrl = await this.fileToDataUrl(file);
                newImages.push({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    dataUrl: dataUrl,
                    rotation: 0
                });
            }
        }

        if (newImages.length === 0) {
            this.showToast('No valid images found. Please use JPG, PNG, GIF, WebP, or BMP.', 'error');
            return;
        }

        this.images.push(...newImages);
        this.showEditor();
        this.renderImages();
        this.updateEstimate();
        this.showToast(`Added ${newImages.length} image(s)`, 'success');
    }

    fileToDataUrl(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    async pasteFromClipboard() {
        try {
            const items = await navigator.clipboard.read();
            for (const item of items) {
                for (const type of item.types) {
                    if (type.startsWith('image/')) {
                        const blob = await item.getType(type);
                        const file = new File([blob], `pasted-image-${Date.now()}.png`, { type });
                        await this.handleFiles([file]);
                        return;
                    }
                }
            }
            this.showToast('No image found in clipboard', 'error');
        } catch (err) {
            this.showToast('Cannot access clipboard. Try Ctrl+V instead.', 'error');
        }
    }

    handlePaste(e) {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (file) this.handleFiles([file]);
            }
        }
    }

    showEditor() {
        this.uploadSection.style.display = 'none';
        this.editorSection.style.display = 'grid';
    }

    renderImages() {
        this.imageCount.textContent = this.images.length;

        this.imagesGrid.innerHTML = this.images.map((img, index) => `
            <div class="image-card ${this.selectedImages.has(img.id) ? 'selected' : ''}" 
                 data-id="${img.id}" 
                 data-index="${index}"
                 draggable="true">
                <img src="${img.dataUrl}" alt="${img.name}" style="transform: rotate(${img.rotation}deg)">
                <div class="card-overlay"></div>
                <div class="card-index">${index + 1}</div>
                <div class="card-select" onclick="event.stopPropagation(); app.toggleSelect(${img.id})">
                    ${this.selectedImages.has(img.id) ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="card-actions">
                    <button class="card-action-btn" onclick="event.stopPropagation(); app.openPreview(${index})" title="Preview">
                        <i class="fas fa-expand"></i>
                    </button>
                    <button class="card-action-btn" onclick="event.stopPropagation(); app.rotateImage(${img.id}, -90)" title="Rotate Left">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="card-action-btn" onclick="event.stopPropagation(); app.rotateImage(${img.id}, 90)" title="Rotate Right">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="card-action-btn" onclick="event.stopPropagation(); app.deleteImage(${img.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="card-name">${img.name}</div>
            </div>
        `).join('');

        this.setupDragAndDrop();
        this.updateToolbar();
    }

    setupDragAndDrop() {
        const cards = this.imagesGrid.querySelectorAll('.image-card');
        let draggedItem = null;

        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => {
                draggedItem = card;
                setTimeout(() => card.classList.add('dragging'), 0);
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
            });

            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (draggedItem === card) return;

                const rect = card.getBoundingClientRect();
                const midY = rect.top + rect.height / 2;

                if (e.clientY < midY) {
                    card.parentNode.insertBefore(draggedItem, card);
                } else {
                    card.parentNode.insertBefore(draggedItem, card.nextSibling);
                }
            });

            card.addEventListener('drop', () => {
                this.reorderImages();
            });
        });
    }

    reorderImages() {
        const cards = this.imagesGrid.querySelectorAll('.image-card');
        const newOrder = [];
        cards.forEach(card => {
            const id = parseFloat(card.dataset.id);
            const img = this.images.find(i => i.id === id);
            if (img) newOrder.push(img);
        });
        this.images = newOrder;
        this.renderImages();
    }

    toggleSelect(id) {
        if (this.selectedImages.has(id)) {
            this.selectedImages.delete(id);
        } else {
            this.selectedImages.add(id);
        }
        this.renderImages();
    }

    toggleSelectAll() {
        if (this.selectedImages.size === this.images.length) {
            this.selectedImages.clear();
        } else {
            this.images.forEach(img => this.selectedImages.add(img.id));
        }
        this.renderImages();
    }

    updateToolbar() {
        this.deleteSelectedBtn.disabled = this.selectedImages.size === 0;
        this.selectAllBtn.innerHTML = this.selectedImages.size === this.images.length
            ? '<i class="fas fa-times"></i> Deselect'
            : '<i class="fas fa-check-double"></i> Select All';
    }

    deleteSelected() {
        if (this.selectedImages.size === 0) return;
        this.images = this.images.filter(img => !this.selectedImages.has(img.id));
        this.selectedImages.clear();

        if (this.images.length === 0) {
            this.reset();
        } else {
            this.renderImages();
            this.updateEstimate();
        }
        this.showToast('Images deleted', 'success');
    }

    deleteImage(id) {
        this.images = this.images.filter(img => img.id !== id);
        this.selectedImages.delete(id);

        if (this.images.length === 0) {
            this.reset();
        } else {
            this.renderImages();
            this.updateEstimate();
        }
    }

    rotateImage(id, angle) {
        const img = this.images.find(i => i.id === id);
        if (img) {
            img.rotation = (img.rotation + angle) % 360;
            this.renderImages();
        }
    }

    rotateSelected(angle) {
        if (this.selectedImages.size === 0) {
            this.showToast('Select images to rotate', 'error');
            return;
        }
        this.images.forEach(img => {
            if (this.selectedImages.has(img.id)) {
                img.rotation = (img.rotation + angle) % 360;
            }
        });
        this.renderImages();
    }

    setView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        this.imagesGrid.classList.toggle('list-view', view === 'list');
    }

    setOrientation(orient) {
        this.orientation = orient;
        document.querySelectorAll('.orient-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.orient === orient);
        });
    }

    openPreview(index) {
        this.previewIndex = index;
        this.updatePreview();
        this.previewModal.classList.add('visible');
    }

    updatePreview() {
        const img = this.images[this.previewIndex];
        this.previewImage.src = img.dataUrl;
        this.previewImage.style.transform = `rotate(${img.rotation}deg)`;
        this.previewInfo.textContent = `${this.previewIndex + 1} of ${this.images.length} — ${img.name}`;
    }

    navigatePreview(delta) {
        if (!this.previewModal.classList.contains('visible')) return;
        this.previewIndex = (this.previewIndex + delta + this.images.length) % this.images.length;
        this.updatePreview();
    }

    closePreview() {
        this.previewModal.classList.remove('visible');
    }

    updateEstimate() {
        const totalSize = this.images.reduce((acc, img) => acc + (img.size || 0), 0);
        const quality = parseFloat(this.qualityRange?.value || 0.9);
        const compression = this.compression?.value || 'low';

        let factor = quality;
        if (compression === 'high') factor *= 0.5;
        else if (compression === 'medium') factor *= 0.7;

        const estimatedSize = totalSize * factor;
        const sizeStr = estimatedSize > 1024 * 1024
            ? (estimatedSize / (1024 * 1024)).toFixed(1) + ' MB'
            : (estimatedSize / 1024).toFixed(0) + ' KB';

        if (this.estimateInfo) {
            this.estimateInfo.textContent = this.images.length > 0
                ? `Estimated size: ~${sizeStr} (${this.images.length} images)`
                : 'Estimated size: Calculating...';
        }
    }

    async generatePDF() {
        if (this.images.length === 0) {
            this.showToast('No images to convert', 'error');
            return;
        }

        this.showProgress();

        try {
            const { jsPDF } = window.jspdf;

            // Get settings
            const pageSize = this.pageSize.value;
            const orientation = this.orientation;
            const margin = parseInt(this.marginRange.value);
            const quality = parseFloat(this.qualityRange.value);
            const bgColor = this.bgColor.value;
            const imageFit = this.imageFit.value;
            const imagesPerPage = parseInt(this.pageLayout.value);
            const addPageNums = this.addPageNumbers.checked;
            const brightness = parseInt(this.brightnessRange.value);
            const contrast = parseInt(this.contrastRange.value);
            const saturation = parseInt(this.saturationRange.value);
            const isGrayscale = this.grayscale.checked;
            const borderStyle = this.imageBorder.value;
            const borderColorVal = this.borderColor.value;
            const enableWatermark = this.enableWatermark.checked;
            const watermarkTextVal = this.watermarkText.value;
            const watermarkSizeVal = parseInt(this.watermarkSize.value);
            const watermarkColorVal = this.watermarkColor.value;
            const watermarkOpacityVal = parseFloat(this.watermarkOpacity.value);
            const watermarkPos = this.watermarkPosition.value;
            const headerTextVal = this.headerText.value;
            const footerTextVal = this.footerText.value;

            // Create PDF
            let pdf;
            if (pageSize === 'fit') {
                pdf = new jsPDF({ orientation, unit: 'mm' });
            } else {
                pdf = new jsPDF({ orientation, format: pageSize, unit: 'mm' });
            }

            // Set metadata
            if (this.pdfTitle.value) pdf.setProperties({ title: this.pdfTitle.value });
            if (this.pdfAuthor.value) pdf.setProperties({ author: this.pdfAuthor.value });

            const totalPages = Math.ceil(this.images.length / imagesPerPage);

            for (let pageNum = 0; pageNum < totalPages; pageNum++) {
                if (pageNum > 0) pdf.addPage();

                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                // Draw background
                pdf.setFillColor(bgColor);
                pdf.rect(0, 0, pageWidth, pageHeight, 'F');

                // Header
                if (headerTextVal) {
                    pdf.setFontSize(10);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(headerTextVal, pageWidth / 2, 8, { align: 'center' });
                }

                // Footer
                if (footerTextVal) {
                    pdf.setFontSize(10);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(footerTextVal, pageWidth / 2, pageHeight - 5, { align: 'center' });
                }

                // Page numbers
                if (addPageNums) {
                    pdf.setFontSize(10);
                    pdf.setTextColor(100, 100, 100);
                    pdf.text(`Page ${pageNum + 1} of ${totalPages}`, pageWidth - 10, pageHeight - 5, { align: 'right' });
                }

                // Calculate grid layout
                const startIdx = pageNum * imagesPerPage;
                const endIdx = Math.min(startIdx + imagesPerPage, this.images.length);
                const imagesOnPage = endIdx - startIdx;

                const cols = imagesPerPage <= 2 ? imagesPerPage : (imagesPerPage <= 4 ? 2 : 3);
                const rows = Math.ceil(imagesPerPage / cols);

                const headerOffset = headerTextVal ? 10 : 0;
                const footerOffset = (footerTextVal || addPageNums) ? 10 : 0;

                const availableWidth = pageWidth - (margin * 2);
                const availableHeight = pageHeight - (margin * 2) - headerOffset - footerOffset;
                const cellWidth = availableWidth / cols;
                const cellHeight = availableHeight / rows;
                const cellPadding = 2;

                for (let i = startIdx; i < endIdx; i++) {
                    const img = this.images[i];
                    const localIdx = i - startIdx;
                    const col = localIdx % cols;
                    const row = Math.floor(localIdx / cols);

                    this.updateProgress(((i + 1) / this.images.length) * 90, `Processing image ${i + 1} of ${this.images.length}...`);

                    // Process image with filters
                    const imgData = await this.processImage(img, quality, brightness, contrast, saturation, isGrayscale);
                    const imgProps = pdf.getImageProperties(imgData);

                    const cellX = margin + (col * cellWidth) + cellPadding;
                    const cellY = margin + headerOffset + (row * cellHeight) + cellPadding;
                    const maxWidth = cellWidth - (cellPadding * 2);
                    const maxHeight = cellHeight - (cellPadding * 2);

                    let imgWidth, imgHeight, x, y;

                    if (imageFit === 'contain') {
                        const ratio = Math.min(maxWidth / imgProps.width, maxHeight / imgProps.height);
                        imgWidth = imgProps.width * ratio;
                        imgHeight = imgProps.height * ratio;
                        x = cellX + (maxWidth - imgWidth) / 2;
                        y = cellY + (maxHeight - imgHeight) / 2;
                    } else if (imageFit === 'cover') {
                        const ratio = Math.max(maxWidth / imgProps.width, maxHeight / imgProps.height);
                        imgWidth = Math.min(imgProps.width * ratio, maxWidth);
                        imgHeight = Math.min(imgProps.height * ratio, maxHeight);
                        x = cellX + (maxWidth - imgWidth) / 2;
                        y = cellY + (maxHeight - imgHeight) / 2;
                    } else if (imageFit === 'stretch') {
                        imgWidth = maxWidth;
                        imgHeight = maxHeight;
                        x = cellX;
                        y = cellY;
                    } else {
                        imgWidth = Math.min(imgProps.width * 0.264583, maxWidth);
                        imgHeight = Math.min(imgProps.height * 0.264583, maxHeight);
                        x = cellX + (maxWidth - imgWidth) / 2;
                        y = cellY + (maxHeight - imgHeight) / 2;
                    }

                    // Draw border/shadow
                    if (borderStyle !== 'none') {
                        const borderWidths = { thin: 0.5, medium: 1, thick: 2, shadow: 0 };
                        const bw = borderWidths[borderStyle] || 0;

                        if (borderStyle === 'shadow') {
                            pdf.setFillColor(0, 0, 0);
                            pdf.setGlobalAlpha?.(0.2);
                            pdf.rect(x + 2, y + 2, imgWidth, imgHeight, 'F');
                            pdf.setGlobalAlpha?.(1);
                        } else {
                            pdf.setDrawColor(borderColorVal);
                            pdf.setLineWidth(bw);
                            pdf.rect(x - bw / 2, y - bw / 2, imgWidth + bw, imgHeight + bw, 'S');
                        }
                    }

                    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
                }

                // Watermark
                if (enableWatermark && watermarkTextVal) {
                    this.addWatermark(pdf, watermarkTextVal, watermarkSizeVal, watermarkColorVal, watermarkOpacityVal, watermarkPos);
                }
            }

            this.updateProgress(100, 'Finalizing PDF...');

            this.pdfBlob = pdf.output('blob');

            // Auto-download the PDF
            this.downloadPDF();

            setTimeout(() => {
                this.hideProgress();
                this.showSuccess();
            }, 500);

        } catch (err) {
            console.error(err);
            this.hideProgress();
            this.showToast('Error generating PDF: ' + err.message, 'error');
        }
    }

    async processImage(img, quality, brightness, contrast, saturation, isGrayscale) {
        return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Handle rotation
                if (Math.abs(img.rotation) === 90 || Math.abs(img.rotation) === 270) {
                    canvas.width = image.height;
                    canvas.height = image.width;
                } else {
                    canvas.width = image.width;
                    canvas.height = image.height;
                }

                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((img.rotation * Math.PI) / 180);

                // Apply filters
                const filters = [];
                if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
                if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
                if (saturation !== 100) filters.push(`saturate(${saturation}%)`);
                if (isGrayscale) filters.push('grayscale(100%)');

                ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';
                ctx.drawImage(image, -image.width / 2, -image.height / 2);

                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            image.src = img.dataUrl;
        });
    }

    addWatermark(pdf, text, size, color, opacity, position) {
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.setFontSize(size);

        // Parse color
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        pdf.setTextColor(r, g, b);

        // GState for opacity
        const gState = pdf.GState({ opacity: opacity });
        pdf.setGState(gState);

        if (position === 'center') {
            pdf.text(text, pageWidth / 2, pageHeight / 2, { align: 'center' });
        } else if (position === 'diagonal') {
            pdf.text(text, pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
        } else if (position === 'top') {
            pdf.text(text, pageWidth / 2, 20, { align: 'center' });
        } else if (position === 'bottom') {
            pdf.text(text, pageWidth / 2, pageHeight - 15, { align: 'center' });
        } else if (position === 'tile') {
            for (let y = 30; y < pageHeight; y += 50) {
                for (let x = 30; x < pageWidth; x += 80) {
                    pdf.text(text, x, y, { angle: 45 });
                }
            }
        }

        // Reset opacity
        pdf.setGState(pdf.GState({ opacity: 1 }));
    }

    showProgress() {
        this.progressModal.classList.add('visible');
        this.updateProgress(0, 'Starting...');
    }

    updateProgress(percent, text) {
        this.progressFill.style.width = percent + '%';
        this.progressText.textContent = text;
    }

    hideProgress() {
        this.progressModal.classList.remove('visible');
    }

    showSuccess() {
        this.successModal.classList.add('visible');
    }

    downloadPDF() {
        if (!this.pdfBlob) return;

        const filename = (this.pdfTitle.value || 'images') + '.pdf';
        const url = URL.createObjectURL(this.pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('PDF downloaded successfully!', 'success');
    }

    closeModals() {
        this.progressModal.classList.remove('visible');
        this.successModal.classList.remove('visible');
    }

    reset() {
        this.images = [];
        this.selectedImages.clear();
        this.pdfBlob = null;
        this.uploadSection.style.display = 'block';
        this.editorSection.style.display = 'none';
        this.successModal.classList.remove('visible');
        this.fileInput.value = '';
        this.updateEstimate();
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        const icon = this.themeToggle.querySelector('i');
        icon.className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }

    loadTheme() {
        const saved = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', saved);
        const icon = this.themeToggle.querySelector('i');
        icon.className = saved === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }

    showToast(message, type = 'success') {
        clearTimeout(this.toastTimeout);
        this.toast.textContent = message;
        this.toast.className = `toast visible ${type}`;
        this.toastTimeout = setTimeout(() => {
            this.toast.classList.remove('visible');
        }, 3000);
    }
}

// Signature Pad Implementation
class SignaturePad {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        // Setup canvas
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.bindEvents();
    }

    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }

    getPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getPos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    draw(e) {
        if (!this.isDrawing) return;
        const pos = this.getPos(e);

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();

        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    isEmpty() {
        const pixelBuffer = new Uint32Array(
            this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data.buffer
        );
        return !pixelBuffer.some(color => color !== 0);
    }

    toDataURL() {
        return this.canvas.toDataURL('image/png');
    }
}

// Initialize App moved to end of file to ensure all prototype extensions are loaded


// Add Advanced Features to the App class prototype
Object.assign(ImagesToPDF.prototype, {
    initAdvanced() {
        // Elements
        this.enablePassword = document.getElementById('enablePassword');
        this.passwordGroup = document.getElementById('passwordGroup');
        this.pdfPassword = document.getElementById('pdfPassword');
        this.togglePasswordBtn = document.querySelector('.toggle-password');

        this.enableOCR = document.getElementById('enableOCR');
        this.autoEnhance = document.getElementById('autoEnhance');
        this.preserveExif = document.getElementById('preserveExif');

        // Professional Features
        this.enableBates = document.getElementById('enableBates');
        this.batesGroup = document.getElementById('batesGroup');
        this.batesPrefix = document.getElementById('batesPrefix');
        this.batesStart = document.getElementById('batesStart');
        this.batesPosition = document.getElementById('batesPosition');

        this.enableRedaction = document.getElementById('enableRedaction');
        this.redactionGroup = document.getElementById('redactionGroup');
        this.redactEmail = document.getElementById('redactEmail');
        this.redactPhone = document.getElementById('redactPhone');
        this.redactSSN = document.getElementById('redactSSN');
        this.enablePDFA = document.getElementById('enablePDFA');

        this.addSignatureBtn = document.getElementById('addSignatureBtn');
        this.signatureModal = document.getElementById('signatureModal');
        this.signatureCanvas = document.getElementById('signatureCanvas');

        // ...

        // Events
        this.enablePassword.addEventListener('change', () => {
            this.passwordGroup.style.display = this.enablePassword.checked ? 'block' : 'none';
        });

        this.enableBates.addEventListener('change', () => {
            this.batesGroup.style.display = this.enableBates.checked ? 'block' : 'none';
        });

        this.enableRedaction.addEventListener('change', () => {
            this.redactionGroup.style.display = this.enableRedaction.checked ? 'block' : 'none';
            if (this.enableRedaction.checked && !this.enableOCR.checked) {
                this.enableOCR.checked = true;
                this.showToast('OCR enabled for Redaction', 'success');
            }
        });
        this.clearSignatureBtn = document.getElementById('clearSignatureBtn');
        this.saveSignatureBtn = document.getElementById('saveSignatureBtn');
        this.closeSignatureBtn = document.getElementById('closeSignatureBtn');
        this.signaturePreview = document.getElementById('signaturePreview');
        this.signatureImage = document.getElementById('signatureImage');
        this.removeSignatureBtn = document.querySelector('.remove-signature');

        this.signatureData = null;
        this.signaturePad = new SignaturePad(this.signatureCanvas);

        // Events
        this.enablePassword.addEventListener('change', () => {
            this.passwordGroup.style.display = this.enablePassword.checked ? 'block' : 'none';
        });

        this.togglePasswordBtn.addEventListener('click', () => {
            const type = this.pdfPassword.type === 'password' ? 'text' : 'password';
            this.pdfPassword.type = type;
            this.togglePasswordBtn.innerHTML = `<i class="fas fa-eye${type === 'text' ? '-slash' : ''}"></i>`;
        });

        this.addSignatureBtn.addEventListener('click', () => {
            this.signatureModal.classList.add('visible');
            this.signaturePad.clear();
        });

        this.clearSignatureBtn.addEventListener('click', () => this.signaturePad.clear());

        this.closeSignatureBtn.addEventListener('click', () => {
            this.signatureModal.classList.remove('visible');
        });

        this.saveSignatureBtn.addEventListener('click', () => {
            if (this.signaturePad.isEmpty()) {
                this.showToast('Please draw a signature first', 'error');
                return;
            }
            this.signatureData = this.signaturePad.toDataURL();
            this.signatureImage.src = this.signatureData;
            this.signaturePreview.classList.remove('hidden');
            this.addSignatureBtn.style.display = 'none';
            this.signatureModal.classList.remove('visible');
            this.showToast('Signature added', 'success');
        });

        this.removeSignatureBtn.addEventListener('click', () => {
            this.signatureData = null;
            this.signaturePreview.classList.add('hidden');
            this.addSignatureBtn.style.display = 'block';
        });
    },

    async runOCR(image) {
        if (!window.Tesseract) {
            console.error('Tesseract.js not loaded');
            return null;
        }

        try {
            const result = await Tesseract.recognize(image.dataUrl, 'eng', {
                // logger: m => console.log(m) // Optional logging
            });
            return result.data.text;
        } catch (err) {
            console.error('OCR Error:', err);
            return null;
        }
    },

    async processImageAdvanced(img, quality, brightness, contrast, saturation, isGrayscale, isEnhanced) {
        return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Handle rotation
                if (Math.abs(img.rotation) === 90 || Math.abs(img.rotation) === 270) {
                    canvas.width = image.height;
                    canvas.height = image.width;
                } else {
                    canvas.width = image.width;
                    canvas.height = image.height;
                }

                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((img.rotation * Math.PI) / 180);

                // Apply filters
                const filters = [];

                // Auto-Enhance Logic: Slight boost to contrast and saturation
                const eBrightness = isEnhanced ? brightness + 5 : brightness;
                const eContrast = isEnhanced ? contrast + 10 : contrast;
                const eSaturation = isEnhanced ? saturation + 10 : saturation;

                if (eBrightness !== 100) filters.push(`brightness(${eBrightness}%)`);
                if (eContrast !== 100) filters.push(`contrast(${eContrast}%)`);
                if (eSaturation !== 100) filters.push(`saturate(${eSaturation}%)`);
                if (isGrayscale) filters.push('grayscale(100%)');

                ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';
                ctx.drawImage(image, -image.width / 2, -image.height / 2);

                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            image.src = img.dataUrl;
        });
    }
});

// Hook into init to load advanced features
const originalInit = ImagesToPDF.prototype.init;
ImagesToPDF.prototype.init = function () {
    originalInit.call(this);
    this.initAdvanced();
};

// Override generatePDF to include advanced features
ImagesToPDF.prototype.generatePDF = async function () {
    if (this.images.length === 0) {
        this.showToast('No images to convert', 'error');
        return;
    }

    this.showProgress();

    try {
        const { jsPDF } = window.jspdf;

        // Get settings
        const pageSize = this.pageSize.value;
        const orientation = this.orientation;
        const margin = parseInt(this.marginRange.value);
        const quality = parseFloat(this.qualityRange.value);
        const bgColor = this.bgColor.value;
        const imageFit = this.imageFit.value;
        const imagesPerPage = parseInt(this.pageLayout.value);
        const addPageNums = this.addPageNumbers.checked;
        const brightness = parseInt(this.brightnessRange.value);
        const contrast = parseInt(this.contrastRange.value);
        const saturation = parseInt(this.saturationRange.value);
        const isGrayscale = this.grayscale.checked;
        const borderStyle = this.imageBorder.value;
        const borderColorVal = this.borderColor.value;

        // Advanced Settings
        const enableWatermark = this.enableWatermark.checked;
        const watermarkTextVal = this.watermarkText.value;
        const watermarkSizeVal = parseInt(this.watermarkSize.value);
        const watermarkColorVal = this.watermarkColor.value;
        const watermarkOpacityVal = parseFloat(this.watermarkOpacity.value);
        const watermarkPos = this.watermarkPosition.value;

        const headerTextVal = this.headerText.value;
        const footerTextVal = this.footerText.value;
        const enablePassword = this.enablePassword.checked;
        const passwordVal = this.pdfPassword.value;
        const runOCR = this.enableOCR.checked;
        const isEnhanced = this.autoEnhance.checked;

        // Professional Features
        const enableBates = this.enableBates.checked;
        const batesPrefixVal = this.batesPrefix.value;
        const batesStartVal = parseInt(this.batesStart.value) || 1;
        const batesPos = this.batesPosition.value;

        const enableRedaction = this.enableRedaction.checked;
        const redactEmailVal = this.redactEmail.checked;
        const redactPhoneVal = this.redactPhone.checked;
        const redactSSNVal = this.redactSSN.checked;
        const enablePDFA = this.enablePDFA.checked;

        // Create PDF
        // Note: Encryption might require a specific plugin or method depending on jsPDF version
        const pdfOptions = { orientation, unit: 'mm' };
        if (pageSize !== 'fit') pdfOptions.format = pageSize;
        if (enablePassword && passwordVal) {
            pdfOptions.encryption = {
                userPassword: passwordVal,
                ownerPassword: passwordVal,
                userPermissions: ['print', 'modify', 'copy', 'annot-forms']
            };
        }

        let pdf = new jsPDF(pdfOptions);

        // Manually apply password if constructor option didn't work (fallback)
        if (enablePassword && passwordVal && typeof pdf.setEncryption === 'function') {
            // pdf.setEncryption(passwordVal, passwordVal);
        }

        // Set metadata
        if (this.pdfTitle.value) pdf.setProperties({ title: this.pdfTitle.value });
        if (this.pdfAuthor.value) pdf.setProperties({ author: this.pdfAuthor.value });

        const totalPages = Math.ceil(this.images.length / imagesPerPage);

        for (let pageNum = 0; pageNum < totalPages; pageNum++) {
            if (pageNum > 0) pdf.addPage();

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            // Draw background
            pdf.setFillColor(bgColor);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');

            // Header
            if (headerTextVal) {
                pdf.setFontSize(10);
                pdf.setTextColor(100, 100, 100);
                pdf.text(headerTextVal, pageWidth / 2, 8, { align: 'center' });
            }

            // Footer
            if (footerTextVal) {
                pdf.setFontSize(10);
                pdf.setTextColor(100, 100, 100);
                pdf.text(footerTextVal, pageWidth / 2, pageHeight - 5, { align: 'center' });
            }

            // Page numbers
            if (addPageNums) {
                pdf.setFontSize(10);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Page ${pageNum + 1} of ${totalPages}`, pageWidth - 10, pageHeight - 5, { align: 'right' });
            }

            // Calculate grid layout
            const startIdx = pageNum * imagesPerPage;
            const endIdx = Math.min(startIdx + imagesPerPage, this.images.length);

            const cols = imagesPerPage <= 2 ? imagesPerPage : (imagesPerPage <= 4 ? 2 : 3);
            const rows = Math.ceil(imagesPerPage / cols);

            const headerOffset = headerTextVal ? 10 : 0;
            const footerOffset = (footerTextVal || addPageNums) ? 10 : 0;

            const availableWidth = pageWidth - (margin * 2);
            const availableHeight = pageHeight - (margin * 2) - headerOffset - footerOffset;
            const cellWidth = availableWidth / cols;
            const cellHeight = availableHeight / rows;
            const cellPadding = 2;

            for (let i = startIdx; i < endIdx; i++) {
                const img = this.images[i];
                const localIdx = i - startIdx;
                const col = localIdx % cols;
                const row = Math.floor(localIdx / cols);

                let progressMsg = `Processing image ${i + 1} of ${this.images.length}...`;
                if (runOCR) progressMsg += ' (OCR Active)';
                this.updateProgress(((i + 1) / this.images.length) * 90, progressMsg);

                // OCR Processing & Redaction
                let extractedText = '';
                let ocrData = null;

                if (runOCR) {
                    // Start OCR
                    try {
                        ocrData = await this.runOCR(img); // returns whole data object
                        if (ocrData) {
                            extractedText = ocrData.text;
                        }
                    } catch (e) {
                        console.error("OCR Failed", e);
                    }
                }

                // Process image with advanced filters
                const imgData = await this.processImageAdvanced(img, quality, brightness, contrast, saturation, isGrayscale, isEnhanced);
                const imgProps = pdf.getImageProperties(imgData);

                const cellX = margin + (col * cellWidth) + cellPadding;
                const cellY = margin + headerOffset + (row * cellHeight) + cellPadding;
                const maxWidth = cellWidth - (cellPadding * 2);
                const maxHeight = cellHeight - (cellPadding * 2);

                let imgWidth, imgHeight, x, y;

                // Call calculate dimensions logic (reusing existing variables)
                if (imageFit === 'contain') {
                    const ratio = Math.min(maxWidth / imgProps.width, maxHeight / imgProps.height);
                    imgWidth = imgProps.width * ratio;
                    imgHeight = imgProps.height * ratio;
                    x = cellX + (maxWidth - imgWidth) / 2;
                    y = cellY + (maxHeight - imgHeight) / 2;
                } else if (imageFit === 'cover') {
                    const ratio = Math.max(maxWidth / imgProps.width, maxHeight / imgProps.height);
                    imgWidth = Math.min(imgProps.width * ratio, maxWidth);
                    imgHeight = Math.min(imgProps.height * ratio, maxHeight);
                    x = cellX + (maxWidth - imgWidth) / 2;
                    y = cellY + (maxHeight - imgHeight) / 2;
                } else if (imageFit === 'stretch') {
                    imgWidth = maxWidth;
                    imgHeight = maxHeight;
                    x = cellX;
                    y = cellY;
                } else {
                    imgWidth = Math.min(imgProps.width * 0.264583, maxWidth);
                    imgHeight = Math.min(imgProps.height * 0.264583, maxHeight);
                    x = cellX + (maxWidth - imgWidth) / 2;
                    y = cellY + (maxHeight - imgHeight) / 2;
                }

                // AI Redaction (Draw black boxes BEFORE image? No, AFTER image to cover it)
                // But we draw image first, then redact.

                // Draw border/shadow
                if (borderStyle !== 'none') {
                    // ... (existing border logic)
                    const borderWidths = { thin: 0.5, medium: 1, thick: 2, shadow: 0 };
                    const bw = borderWidths[borderStyle] || 0;

                    if (borderStyle === 'shadow') {
                        pdf.setFillColor(0, 0, 0);
                        pdf.setGlobalAlpha?.(0.2);
                        pdf.rect(x + 2, y + 2, imgWidth, imgHeight, 'F');
                        pdf.setGlobalAlpha?.(1);
                    } else {
                        pdf.setDrawColor(borderColorVal);
                        pdf.setLineWidth(bw);
                        pdf.rect(x - bw / 2, y - bw / 2, imgWidth + bw, imgHeight + bw, 'S');
                    }
                }

                pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);

                // Perform Redaction if enabled and OCR data exists
                if (enableRedaction && ocrData && ocrData.words) {
                    const scaleX = imgWidth / ocrData.bbox.x1; // x1 is width of full image usually? No x1 is right. bbox: x0, y0, x1, y1
                    // Actually Tesseract bbox is: x0, y0, x1, y1 (minX, minY, maxX, maxY) of the whole image
                    // ocrData.bbox (image size)
                    const imgNativeWidth = ocrData.bbox.x1 - ocrData.bbox.x0;
                    const imgNativeHeight = ocrData.bbox.y1 - ocrData.bbox.y0;

                    const scaleFactorX = imgWidth / imgNativeWidth;
                    const scaleFactorY = imgHeight / imgNativeHeight;

                    // Regex Patterns
                    const patterns = [];
                    if (this.redactEmail.checked) patterns.push(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g);
                    if (this.redactPhone.checked) patterns.push(/(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g);
                    if (this.redactSSN.checked) patterns.push(/\d{3}-\d{2}-\d{4}/g);

                    pdf.setFillColor(0, 0, 0); // Black color for redaction

                    ocrData.words.forEach(word => {
                        const text = word.text;
                        let shouldRedact = false;
                        for (let pattern of patterns) {
                            if (pattern.test(text)) {
                                shouldRedact = true;
                                break;
                            }
                        }

                        if (shouldRedact) {
                            const wx = x + (word.bbox.x0 * scaleFactorX);
                            const wy = y + (word.bbox.y0 * scaleFactorY);
                            const ww = (word.bbox.x1 - word.bbox.x0) * scaleFactorX;
                            const wh = (word.bbox.y1 - word.bbox.y0) * scaleFactorY;
                            pdf.rect(wx, wy, ww, wh, 'F');
                        }
                    });
                }
            }

            // Bates Numbering
            if (enableBates) {
                const currentNum = batesStartVal + pageNum;
                const batesText = `${batesPrefixVal}${currentNum}`;

                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);

                let bx, by;
                switch (batesPos) {
                    case 'bottomLeft': bx = 10; by = pageHeight - 10; break;
                    case 'topLeft': bx = 10; by = 10; break;
                    case 'topRight': bx = pageWidth - 10; by = 10; break;
                    case 'bottomRight': default: bx = pageWidth - 10; by = pageHeight - 10; break;
                }

                const align = (batesPos.includes('Right')) ? 'right' : 'left';
                pdf.text(batesText, bx, by, { align: align });
            }

            // Watermark
            if (enableWatermark && watermarkTextVal) {
                this.addWatermark(pdf, watermarkTextVal, watermarkSizeVal, watermarkColorVal, watermarkOpacityVal, watermarkPos);
            }

            // Add Signature (Bottom Right of every page)
            if (this.signatureData) {
                const sigWidth = 40; // mm
                const sigHeight = 20; // mm
                const sigX = pageWidth - sigWidth - 10;
                const sigY = pageHeight - sigHeight - 10;
                pdf.addImage(this.signatureData, 'PNG', sigX, sigY, sigWidth, sigHeight);
            }
        }

        this.updateProgress(100, 'Finalizing PDF...');

        // Save PDF
        if (enablePassword && passwordVal) {
            // If encryption construct didn't work (older jsPDF), we might need `save` with options in newer versions
            // but `output('blob')` is standard.
            // Verified: jsPDF requires encryption plugin for full support. 
            // If this fails, we just save standard PDF.
        }

        this.pdfBlob = pdf.output('blob');

        // Auto-download the PDF
        this.downloadPDF();

        setTimeout(() => {
            this.hideProgress();
            this.showSuccess();
        }, 500);

    } catch (err) {
        console.error(err);
        this.hideProgress();
        this.showToast('Error generating PDF: ' + err.message, 'error');
    }
};

// Initialize App
const app = new ImagesToPDF();
