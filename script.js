// GeoMeta Database - Complete JavaScript Implementation

// Initialize application
class GeoMetaApp {
    constructor() {
        this.countries = [];
        this.currentCountry = null;
        this.currentMetas = [];
        this.currentSubMetas = [];
        
        this.initializeElements();
        this.loadData();
        this.initializeEventListeners();
        this.renderCountryTabs();
    }

    initializeElements() {
        // Country elements
        this.countrySearchInput = document.getElementById('country-search');
        this.tabsWrapper = document.getElementById('tabs-wrapper');
        
        // Modals
        this.countryModal = document.getElementById('country-modal');
        this.metaModal = document.getElementById('meta-modal');
        
        // Forms
        this.countryForm = document.getElementById('country-form');
        this.metaForm = document.getElementById('meta-form');
        
        // Info panel
        this.countryInfo = document.getElementById('country-info');
        this.metaContainer = document.getElementById('meta-container');
        this.subMetaContainer = document.getElementById('sub-meta-container');
        
        // Stats
        this.totalCountriesEl = document.getElementById('total-countries');
        this.totalMetasEl = document.getElementById('total-metas');
        this.totalImagesEl = document.getElementById('total-images');
    }

    initializeEventListeners() {
        // Country search
        this.countrySearchInput.addEventListener('input', (e) => {
            this.filterCountries(e.target.value);
        });

        // Modal triggers
        document.getElementById('add-country').addEventListener('click', () => {
            this.openCountryModal();
        });

        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        // Forms
        this.countryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCountry();
        });

        this.metaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMeta();
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    // Country Management
    loadData() {
        // Load countries from localStorage
        const storedCountries = localStorage.getItem('geoMetaCountries');
        if (storedCountries) {
            this.countries = JSON.parse(storedCountries);
        } else {
            this.initializeDefaultCountries();
        }
    }

    initializeDefaultCountries() {
        this.countries = [
            {
                id: 'bw',
                name: 'Botswana',
                flag: '🇧🇼',
                region: 'Africa',
                metas: [],
                subMetas: []
            },
            {
                id: 'eg',
                name: 'Egypt',
                flag: '🇪🇬',
                region: 'Africa',
                metas: [],
                subMetas: []
            },
            {
                id: 'in',
                name: 'India',
                flag: '🇮🇳',
                region: 'Asia',
                metas: [],
                subMetas: []
            },
            {
                id: 'us',
                name: 'United States',
                flag: '🇺🇸',
                region: 'North America',
                metas: [],
                subMetas: []
            },
            {
                id: 'br',
                name: 'Brazil',
                flag: '🇧🇷',
                region: 'South America',
                metas: [],
                subMetas: []
            }
        ];
        this.saveData();
    }

    saveData() {
        localStorage.setItem('geoMetaCountries', JSON.stringify(this.countries));
    }

    initializeDefaultMetas() {
        const defaultMetas = [
            {
                id: 'landmark',
                title: 'Landmark Information',
                type: 'landmark',
                description: 'Key landmarks and tourist attractions',
                images: [],
                tags: ['landmark', 'tourist', 'famous'],
                subMetas: []
            },
            {
                id: 'city',
                title: 'City Information',
                type: 'city',
                description: 'Major cities and urban areas',
                images: [],
                tags: ['city', 'urban', 'metropolitan'],
                subMetas: []
            }
        ];
        return defaultMetas;
    }

    // UI Methods
    animateElement(element) {
        element.classList.add('animate__animated', 'animate__fadeInUp');
        setTimeout(() => {
            element.classList.remove('animate__animated', 'animate__fadeInUp');
        }, 2000);
    }

    showLoading(container) {
        container.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </div>
        `;
    }

    // Country Tabs
    renderCountryTabs() {
        this.tabsWrapper.innerHTML = '';
        
        this.countries.forEach((country, index) => {
            const tab = document.createElement('div');
            tab.className = `tab ${country.id === 'bw' ? 'active' : ''}`;
            tab.dataset.countryId = country.id;
            tab.innerHTML = `
                <i class="fas fa-flag" style="margin-right: 8px;"></i>
                ${country.flag} ${country.name}
                <span class="country-count">(${country.metas.length})</span>
            `;
            
            tab.addEventListener('click', () => {
                this.selectCountry(country);
            });
            
            this.tabsWrapper.appendChild(tab);
            
            // Animate in
            setTimeout(() => {
                this.animateElement(tab);
            }, index * 100);
        });

        this.updateStats();
    }

    selectCountry(country) {
        this.currentCountry = country;
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(tab => {
            if (tab.dataset.countryId === country.id) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Load country info
        this.loadCountryInfo(country);
        
        // Load metas
        this.loadMetas(country);
        
        // Load sub-metas
        this.loadSubMetas(country);
    }

    loadCountryInfo(country) {
        this.showLoading(this.countryInfo);
        
        setTimeout(() => {
            this.countryInfo.innerHTML = `
                <div class="country-detail-card">
                    <div class="country-header">
                        <h2>${country.name}</h2>
                        <div class="country-flag">${country.flag}</div>
                    </div>
                    <div class="country-info">
                        <p><strong>Region:</strong> ${country.region}</p>
                        <p><strong>Country Code:</strong> ${country.id.toUpperCase()}</p>
                        <p><strong>Total Metas:</strong> ${country.metas.length}</p>
                        <p><strong>Total Images:</strong> ${this.countImages(country)}</p>
                    </div>
                    <div class="country-actions">
                        <button class="btn-primary" onclick="app.openMetaModal('${country.id}')">
                            <i class="fas fa-plus"></i> Add Meta
                        </button>
                        <button class="btn-secondary" onclick="app.openSubMetaModal('${country.id}')">
                            <i class="fas fa-layer-group"></i> Add Sub-Meta
                        </button>
                    </div>
                </div>
            `;
            
            this.animateElement(this.countryInfo);
        }, 500);
    }

    // Meta Management
    loadMetas(country) {
        this.showLoading(this.metaContainer);
        
        setTimeout(() => {
            this.currentMetas = country.metas;
            
            if (this.currentMetas.length === 0) {
                this.metaContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-map-pin"></i>
                        <h3>No metas added yet</h3>
                        <p>Start by adding your first meta information!</p>
                    </div>
                `;
            } else {
                this.metaContainer.innerHTML = `
                    <div class="meta-grid">
                        ${this.currentMetas.map(meta => this.renderMetaCard(meta)).join('')}
                    </div>
                `;
            }
            
            this.updateStats();
            this.animateElement(this.metaContainer);
        }, 500);
    }

    renderMetaCard(meta) {
        const imageCount = meta.images.length;
        const tagCount = meta.tags.length;
        
        return `
            <div class="meta-card" data-meta-id="${meta.id}">
                <div class="meta-header">
                    <h3>${meta.title}</h3>
                    <span class="meta-type badge">${meta.type}</span>
                </div>
                <p class="meta-description">${meta.description}</p>
                
                <div class="meta-stats">
                    <span><i class="fas fa-image"></i> ${imageCount} images</span>
                    <span><i class="fas fa-tags"></i> ${tagCount} tags</span>
                </div>
                
                ${imageCount > 0 ? `
                    <div class="meta-images">
                        ${meta.images.map((img, idx) => `
                            <img src="${img}" alt="Meta image ${idx + 1}" loading="lazy">
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="meta-tags">
                    ${meta.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
                
                <div class="meta-actions">
                    <button class="btn-sm-primary" onclick="app.editMeta('${meta.id}', '${country.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-sm-secondary" onclick="app.deleteMeta('${meta.id}', '${country.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    openMetaModal(countryId) {
        const country = this.countries.find(c => c.id === countryId);
        
        document.getElementById('modal-title').textContent = `Add Meta for ${country.name}`;
        
        // Clear form
        this.metaForm.reset();
        
        // Set default values
        document.getElementById('meta-title').value = `New Meta Information`;
        document.getElementById('meta-type').value = 'landmark';
        document.getElementById('meta-description').value = `Describe the meta information for ${country.name}`;
        
        this.openModal('meta-modal');
    }

    saveMeta() {
        const title = document.getElementById('meta-title').value;
        const type = document.getElementById('meta-type').value;
        const description = document.getElementById('meta-description').value;
        const imagesInput = document.getElementById('meta-images').value;
        const tagsInput = document.getElementById('meta-tags').value;
        
        const images = imagesInput.split(',').map(img => img.trim()).filter(img => img);
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        const newMeta = {
            id: Date.now().toString(),
            title,
            type,
            description,
            images,
            tags,
            subMetas: []
        };
        
        const country = this.currentCountry;
        country.metas.push(newMeta);
        
        this.saveData();
        this.closeModal('meta-modal');
        this.loadMetas(country);
        
        // Reset form
        this.metaForm.reset();
        
        this.showNotification('Meta saved successfully!', 'success');
    }

    editMeta(metaId, countryId) {
        const country = this.countries.find(c => c.id === countryId);
        const meta = country.metas.find(m => m.id === metaId);
        
        if (!meta) return;
        
        document.getElementById('modal-title').textContent = `Edit Meta: ${meta.title}`;
        document.getElementById('meta-title').value = meta.title;
        document.getElementById('meta-type').value = meta.type;
        document.getElementById('meta-description').value = meta.description;
        document.getElementById('meta-images').value = meta.images.join(', ');
        document.getElementById('meta-tags').value = meta.tags.join(', ');
        
        this.openModal('meta-modal');
        
        // Add save handler for edit mode
        const originalSave = this.saveMeta.bind(this);
        this.saveMeta = () => {
            this.updateMeta(metaId, countryId);
            originalSave();
        };
    }

    updateMeta(metaId, countryId) {
        const country = this.countries.find(c => c.id === countryId);
        const metaIndex = country.metas.findIndex(m => m.id === metaId);
        
        if (metaIndex !== -1) {
            const meta = country.metas[metaIndex];
            meta.title = document.getElementById('meta-title').value;
            meta.type = document.getElementById('meta-type').value;
            meta.description = document.getElementById('meta-description').value;
            
            const imagesInput = document.getElementById('meta-images').value;
            const tagsInput = document.getElementById('meta-tags').value;
            
            meta.images = imagesInput.split(',').map(img => img.trim()).filter(img => img);
            meta.tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
            
            this.saveData();
            this.closeModal('meta-modal');
            this.loadMetas(country);
            
            this.showNotification('Meta updated successfully!', 'success');
        }
    }

    deleteMeta(metaId, countryId) {
        if (confirm('Are you sure you want to delete this meta?')) {
            const country = this.countries.find(c => c.id === countryId);
            country.metas = country.metas.filter(m => m.id !== metaId);
            
            this.saveData();
            this.loadMetas(country);
            
            this.showNotification('Meta deleted successfully!', 'info');
        }
    }

    // Sub-Meta Management
    openSubMetaModal(countryId) {
        const country = this.countries.find(c => c.id === countryId);
        
        document.getElementById('meta-modal-title').textContent = `Add Sub-Meta for ${country.name}`;
        
        this.metaForm.reset();
        document.getElementById('meta-title').value = `Sub-Meta: New Information`;
        document.getElementById('meta-type').value = 'landmark';
        document.getElementById('meta-description').value = `Add detailed sub-meta information for ${country.name}`;
        
        this.openModal('meta-modal');
    }

    loadSubMetas(country) {
        this.showLoading(this.subMetaContainer);
        
        setTimeout(() => {
            this.currentSubMetas = country.metas.flatMap(meta => meta.subMetas);
            
            if (this.currentSubMetas.length === 0) {
                this.subMetaContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-layer-group"></i>
                        <h3>No sub-metas yet</h3>
                        <p>Add sub-metas to your metas for more detailed information!</p>
                    </div>
                `;
            } else {
                this.subMetaContainer.innerHTML = `
                    <div class="sub-meta-grid">
                        ${this.currentSubMetas.
