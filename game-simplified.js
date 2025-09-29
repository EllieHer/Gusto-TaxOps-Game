// Tax Filing Frenzy - Game Logic
console.log('🔥 SCRIPT LOADED - game-simplified.js is running!');
console.log('Current time:', new Date().toLocaleTimeString());

class TaxFilingGame {
    constructor() {
        this.gameState = 'menu';
        this.level = 1;
        this.score = 0;
        this.timeLeft = 30;
        this.formsCompleted = 0;
        this.correctForms = 0;
        this.currentForm = null;
        this.formState = 'empty'; // empty, filled, reviewed, submitted
        this.timer = null;
        this.characterMessages = [
            "Welcome to professional tax form training!",
            "🐼 Use the PANDA Reference Board on the left to find all the correct answers!",
            "🎵 Turn up the volume to hear upbeat Mario-style music and sounds!",
            "Let's-a-go! Time to file some tax forms!",
            "📋 Check the PANDA board - all the information you need is right there!",
            "Remember: Copy the exact information from PANDA into the form fields.",
            "State forms have different filing requirements!",
            "Excellent work on that tax submission!",
            "🐼 PANDA has your back - EIN, wages, taxes, everything!",
            "Tax accuracy prevents costly penalties!",
            "You're mastering multi-state compliance!",
            "Professional tax preparation is critical!",
            "Perfect! Ready for tax season!",
            "🍄 Power up your tax skills with every form!",
            "Speed and accuracy - that's the PANDA way!"
        ];
        
        this.difficultySettings = this.generateDifficultySettings();
        
        // Audio settings
        this.audioEnabled = true;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.volume = 0.7;
        this.audioContext = null;
        
        // User profile settings
        this.currentUser = null;
        this.selectedAvatar = null;
        
        // PANDA reference data - all correct answers for forms
        this.pandaData = {
            companyName: "Gusto Payroll Solutions",
            ein: "94-1234567",
            phone: "(415) 555-0123",
            email: "tax@gustopayroll.com",
            address: "525 20th Street, San Francisco, CA 94107",
            zipCode: "94107",
            totalWages: "125000.00",
            federalIncomeTax: "18750.00",
            socialSecurityTax: "7750.00",
            medicareTax: "1812.50",
            stateTaxRate: "6.2%",
            totalEmployees: "15",
            taxYear: "2024",
            quarter: "Q1",
            filingDate: "2024-04-30",
            periodStart: "2024-01-01",
            periodEnd: "2024-03-31"
        };
        
        // Now initialize form templates AFTER pandaData is available
        this.formTemplates = this.generateFormTemplates();
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.bindEvents();
        this.initializeAudio();
        this.initializeUserProfile();
        this.updatePiggyVisibility();
        this.showCharacterMessage("Ready for professional tax form training?", 3000);
    }
    
    bindEvents() {
        // Game state management - only if elements exist
        const mailbox = document.getElementById('mailbox');
        if (mailbox) {
            mailbox.addEventListener('click', () => {
                if (this.formState === 'reviewed') {
                    this.submitForm();
                }
            });
        }
        
        // Timer warning sounds could be added here
        this.setupTimerWarnings();
        
        // Setup piggy penny interactions
        this.setupPiggyInteractions();
    }
    
    generateDifficultySettings() {
        return [
            { level: 1, timeLimit: 45, fieldsCount: 4, requiredFields: 3, complexFields: 0 },
            { level: 2, timeLimit: 40, fieldsCount: 5, requiredFields: 4, complexFields: 1 },
            { level: 3, timeLimit: 35, fieldsCount: 6, requiredFields: 5, complexFields: 1 },
            { level: 4, timeLimit: 30, fieldsCount: 7, requiredFields: 6, complexFields: 2 },
            { level: 5, timeLimit: 28, fieldsCount: 8, requiredFields: 7, complexFields: 2 },
            { level: 6, timeLimit: 25, fieldsCount: 9, requiredFields: 8, complexFields: 3 },
            { level: 7, timeLimit: 22, fieldsCount: 10, requiredFields: 9, complexFields: 3 },
            { level: 8, timeLimit: 20, fieldsCount: 11, requiredFields: 10, complexFields: 4 },
            { level: 9, timeLimit: 18, fieldsCount: 12, requiredFields: 11, complexFields: 4 },
            { level: 10, timeLimit: 15, fieldsCount: 13, requiredFields: 12, complexFields: 5 }
        ];
    }
    
    generateFormTemplates() {
        const taxForms = {
            // IRS Form 941 - Employer's Quarterly Federal Tax Return
            form941: {
                title: 'IRS Form 941 - Employer\'s Quarterly Federal Tax Return',
                formNumber: '941',
                fields: [
                    { label: 'Employer ID Number (EIN)', type: 'text', validation: 'ein', correct: this.pandaData.ein, required: true },
                    { label: 'Name of Business', type: 'text', validation: 'required', correct: this.pandaData.companyName, required: true },
                    { label: 'Quarter', type: 'select', options: ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'], validation: 'required', correct: this.pandaData.quarter + ' (Jan-Mar)', required: true },
                    { label: 'Total Wages, Tips, Other Compensation', type: 'number', validation: 'currency', correct: this.pandaData.totalWages, required: true },
                    { label: 'Federal Income Tax Withheld', type: 'number', validation: 'currency', correct: this.pandaData.federalIncomeTax, required: true }
                ]
            },
            
            // California DE 9 - Quarterly Contribution and Report Form
            californiaDE9: {
                title: 'California DE 9 - Quarterly Contribution Return and Report',
                formNumber: 'CA DE 9',
                state: 'California',
                fields: [
                    { label: 'CA Employer Account Number', type: 'text', validation: 'required', correct: '123-4567-8', required: true },
                    { label: 'Business Name', type: 'text', validation: 'required', correct: 'Gusto California LLC', required: true },
                    { label: 'Reporting Period', type: 'select', options: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'], validation: 'required', correct: 'Q1 2024', required: true },
                    { label: 'Total Subject Wages', type: 'number', validation: 'currency', correct: '85000.00', required: true },
                    { label: 'UI Contributions Due', type: 'number', validation: 'currency', correct: '2890.00', required: true }
                ]
            },

            // New York NYS-45 - Quarterly Combined Withholding
            newYorkNYS45: {
                title: 'New York NYS-45 - Quarterly Combined Withholding, Wage Reporting',
                formNumber: 'NYS-45',
                state: 'New York',
                fields: [
                    { label: 'NYS ID Number', type: 'text', validation: 'required', correct: 'WTN-123456789', required: true },
                    { label: 'Business Name', type: 'text', validation: 'required', correct: 'Gusto New York Inc', required: true },
                    { label: 'Quarter Ending', type: 'date', validation: 'date', correct: '2024-03-31', required: true },
                    { label: 'Total NYS Wages', type: 'number', validation: 'currency', correct: '95000.00', required: true },
                    { label: 'NYS Income Tax Withheld', type: 'number', validation: 'currency', correct: '5700.00', required: true }
                ]
            },

            // Texas C-3 - Employer's Quarterly Tax Report
            texasC3: {
                title: 'Texas C-3 - Employer\'s Quarterly Tax Report',
                formNumber: 'C-3',
                state: 'Texas',
                fields: [
                    { label: 'TX Employer Account Number', type: 'text', validation: 'required', correct: '12345678901', required: true },
                    { label: 'Legal Business Name', type: 'text', validation: 'required', correct: 'Gusto Texas Operations', required: true },
                    { label: 'Report Period', type: 'select', options: ['1st Qtr 2024', '2nd Qtr 2024', '3rd Qtr 2024', '4th Qtr 2024'], validation: 'required', correct: '1st Qtr 2024', required: true },
                    { label: 'Total Taxable Wages', type: 'number', validation: 'currency', correct: '78000.00', required: true },
                    { label: 'Unemployment Tax Due', type: 'number', validation: 'currency', correct: '2106.00', required: true }
                ]
            },

            // Illinois UI-3/40 - Employer's Quarterly Tax and Wage Report
            illinoisUI3: {
                title: 'Illinois UI-3/40 - Employer\'s Quarterly Tax and Wage Report',
                formNumber: 'UI-3/40',
                state: 'Illinois',
                fields: [
                    { label: 'IL Employer Account Number', type: 'text', validation: 'required', correct: '1234567-8', required: true },
                    { label: 'Employer Name', type: 'text', validation: 'required', correct: 'Gusto Illinois Branch', required: true },
                    { label: 'Calendar Quarter', type: 'select', options: ['1st Quarter 2024', '2nd Quarter 2024', '3rd Quarter 2024', '4th Quarter 2024'], validation: 'required', correct: '1st Quarter 2024', required: true },
                    { label: 'Total Wages Paid', type: 'number', validation: 'currency', correct: '67000.00', required: true },
                    { label: 'UI Tax Due', type: 'number', validation: 'currency', correct: '2043.50', required: true }
                ]
            },

            // Florida RT-6 - Employer's Quarterly Report
            floridaRT6: {
                title: 'Florida RT-6 - Employer\'s Quarterly Report',
                formNumber: 'RT-6',
                state: 'Florida',
                fields: [
                    { label: 'FL Employer Account Number', type: 'text', validation: 'required', correct: '12-3456789-10-1', required: true },
                    { label: 'Business Name', type: 'text', validation: 'required', correct: 'Gusto Florida Services', required: true },
                    { label: 'Quarter', type: 'select', options: ['1st Qtr 2024', '2nd Qtr 2024', '3rd Qtr 2024', '4th Qtr 2024'], validation: 'required', correct: '1st Qtr 2024', required: true },
                    { label: 'Total Wages', type: 'number', validation: 'currency', correct: '89000.00', required: true },
                    { label: 'Tax Due', type: 'number', validation: 'currency', correct: '2403.00', required: true }
                ]
            }
        };
        
        
        return taxForms;
    }
    
    startGame() {
        this.gameState = 'playing';
        this.level = 1;
        this.score = 0;
        this.formsCompleted = 0;
        this.correctForms = 0;
        
        
        const startScreen = document.getElementById('start-screen');
        const gameOverScreen = document.getElementById('game-over-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (startScreen) startScreen.style.display = 'none';
        if (gameOverScreen) gameOverScreen.style.display = 'none';
        if (gameScreen) gameScreen.style.display = 'block';
        
        // Make sure required elements exist
        if (!gameScreen) {
            console.error('Game screen not found!');
            return;
        }
        
        this.currentForm = null;
        this.formState = 'empty';
        this.updateUI();
        this.generateNewForm();
        this.startTimer();
        
        this.updatePiggyVisibility();
        
        // Start background music (requires user interaction)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            // Resume audio context on first user interaction
            this.audioContext.resume().then(() => {
                this.startBackgroundMusic();
            });
        } else {
            this.startBackgroundMusic();
        }
        
        this.showCharacterMessage("🐼 Use the PANDA Reference Board to find all correct answers! Let's go!", 4000);
    }
    
    startTimer() {
        // Clear any existing timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        const difficulty = this.difficultySettings[Math.min(this.level - 1, this.difficultySettings.length - 1)];
        this.timeLeft = difficulty.timeLimit;
        
        // Update UI immediately
        this.updateUI();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            
            if (this.timeLeft <= 10) {
                const timerEl = document.getElementById('timer');
                if (timerEl) {
                    timerEl.style.background = '#e74c3c';
                    timerEl.style.animation = 'timerPulse 0.5s ease-in-out infinite';
                }
            }
            
            if (this.timeLeft === 10) {
                this.showCharacterMessage("Time is running out! Hurry!", 2000);
            }
            
            if (this.timeLeft <= 0) {
                this.gameOver();
            }
        }, 1000);
    }
    
    generateNewForm() {
        // Define form sequence: IRS 941 for level 1, then cycle through state forms
        const formSequence = [
            'form941',           // Level 1: IRS Form 941
            'californiaDE9',     // Level 2: California DE 9
            'newYorkNYS45',      // Level 3: New York NYS-45
            'texasC3',           // Level 4: Texas C-3
            'illinoisUI3',       // Level 5: Illinois UI-3/40
            'floridaRT6'         // Level 6: Florida RT-6
        ];
        
        // Select form based on level, cycling through available forms
        const formIndex = (this.level - 1) % formSequence.length;
        const selectedFormKey = formSequence[formIndex];
        const selectedForm = this.formTemplates[selectedFormKey];
        
        if (!selectedForm) {
            console.error('Form not found:', selectedFormKey);
            return;
        }
        
        // Get difficulty settings for field count limits
        const difficulty = this.difficultySettings[Math.min(this.level - 1, this.difficultySettings.length - 1)];
        
        // Use all fields from the selected tax form, but limit based on difficulty
        let formFields = [...selectedForm.fields];
        
        // For higher levels, show more fields from the form
        const maxFields = Math.min(difficulty.fieldsCount + 2, formFields.length);
        if (formFields.length > maxFields) {
            // Prioritize required fields, then shuffle the rest
            const requiredFields = formFields.filter(field => field.required);
            const optionalFields = formFields.filter(field => !field.required);
            this.shuffleArray(optionalFields);
            
            const fieldsToKeep = Math.max(0, maxFields - requiredFields.length);
            formFields = [...requiredFields, ...optionalFields.slice(0, fieldsToKeep)];
        }
        
        this.currentForm = {
            id: `FORM-${Date.now()}`,
            title: selectedForm.title,
            formNumber: selectedForm.formNumber,
            state: selectedForm.state || 'Federal',
            fields: formFields,
            filledFields: {},
            errors: []
        };
        
        this.formState = 'empty';
        this.renderForm();
        this.updateRequirements();
        this.updateActionButtons();
        this.animateFormEntry();
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    renderForm() {
        const formElement = document.getElementById('current-form');
        
        if (!formElement) {
            console.error('Form element not found!');
            return;
        }
        
        
        let formHTML = `
            <div class="form-header">
                <h3>${this.currentForm.title}</h3>
                <div class="form-meta">
                    <span class="form-number">Form: ${this.currentForm.formNumber}</span>
                    <span class="form-state">${this.currentForm.state}</span>
                    <span class="form-level">Level ${this.level}</span>
                </div>
            </div>
        `;
        
        this.currentForm.fields.forEach((field, index) => {
            const fieldId = `field-${index}`;
            const isRequired = field.required ? 'required' : '';
            const value = this.currentForm.filledFields[fieldId] || '';
            
            formHTML += `<div class="form-field ${isRequired}" id="${fieldId}-container">`;
            formHTML += `<label for="${fieldId}">${field.label}:</label>`;
            
            if (field.type === 'select') {
                formHTML += `<select id="${fieldId}" ${this.formState === 'empty' ? 'disabled' : ''}>`;
                formHTML += `<option value="">Choose...</option>`;
                field.options.forEach(option => {
                    const selected = value === option ? 'selected' : '';
                    formHTML += `<option value="${option}" ${selected}>${option}</option>`;
                });
                formHTML += `</select>`;
            } else {
                const inputType = field.type === 'number' ? 'text' : field.type;
                formHTML += `<input type="${inputType}" id="${fieldId}" value="${value}" ${this.formState === 'empty' ? 'disabled' : ''} placeholder="${this.getPlaceholder(field)}">`;
            }
            
            formHTML += `</div>`;
        });
        
        formElement.innerHTML = formHTML;
        
        // Add event listeners for form validation
        if (this.formState !== 'empty') {
            this.addFormValidationListeners();
        }
        
        // Force re-render of disabled state
        setTimeout(() => {
            this.currentForm.fields.forEach((field, index) => {
                const fieldId = `field-${index}`;
                const element = document.getElementById(fieldId);
                if (element) {
                    element.disabled = this.formState === 'empty';
                }
            });
        }, 100);
    }
    
    getPlaceholder(field) {
        // Tax-specific placeholders based on validation type and field labels
        const placeholders = {
            // EIN and ID Numbers
            'Employer ID Number (EIN)': '12-3456789',
            'CA Employer Account Number': '123-4567-8',
            'NYS ID Number': 'WTN-123456789',
            'TX Employer Account Number': '12345678901',
            'IL Employer Account Number': '1234567-8',
            'FL Employer Account Number': '12-3456789-10-1',
            
            // Business Names
            'Name of Business': 'Company Name',
            'Business Name': 'Company Name',
            'Legal Business Name': 'Company Name',
            'Employer Name': 'Company Name',
            
            // Currencies
            'Total Wages, Tips, Other Compensation': '125000.00',
            'Federal Income Tax Withheld': '18750.00',
            'Taxable Social Security Wages': '125000.00',
            'Social Security Tax': '7750.00',
            'Taxable Medicare Wages': '125000.00',
            'Medicare Tax': '1812.50',
            'Total Subject Wages': '85000.00',
            'UI Contributions Due': '2890.00',
            'Total NYS Wages': '95000.00',
            'NYS Income Tax Withheld': '5700.00',
            'Total Taxable Wages': '78000.00',
            'Unemployment Tax Due': '2106.00',
            'Total Wages Paid': '67000.00',
            'UI Tax Due': '2043.50',
            'Total Wages': '89000.00',
            'Tax Due': '2403.00',
            
            // Percentages
            'UI Contribution Rate': '3.4%',
            'Tax Rate': '2.7%',
            'UI Tax Rate': '3.05%',
            
            // Numbers
            'Number of Employees': '25',
            'Number of Workers': '18',
            'Total Employees': '15',
            
            // Years
            'Tax Year': '2024',
            
            // Dates
            'Quarter Ending': '2024-03-31'
        };
        
        // Return specific placeholder or generate based on validation type
        if (placeholders[field.label]) {
            return placeholders[field.label];
        }
        
        // Generate placeholder based on validation type
        switch (field.validation) {
            case 'ein':
                return '12-3456789';
            case 'currency':
                return '0.00';
            case 'percentage':
                return '0.0%';
            case 'year':
                return '2024';
            case 'date':
                return 'YYYY-MM-DD';
            case 'number':
                return '0';
            default:
                return '';
        }
    }
    
    addFormValidationListeners() {
        this.currentForm.fields.forEach((field, index) => {
            const fieldId = `field-${index}`;
            const element = document.getElementById(fieldId);
            
            if (element) {
                element.addEventListener('input', () => {
                    this.validateField(fieldId, field);
                });
                
                element.addEventListener('change', () => {
                    this.validateField(fieldId, field);
                });
            }
        });
    }
    
    validateField(fieldId, field) {
        const element = document.getElementById(fieldId);
        const container = document.getElementById(`${fieldId}-container`);
        const value = element.value.trim();
        
        // Store the value
        this.currentForm.filledFields[fieldId] = value;
        
        // Remove previous validation classes
        container.classList.remove('error', 'success', 'shake');
        
        // Check if required field is empty
        if (field.required && !value) {
            if (this.formState === 'reviewed') {
                container.classList.add('error');
                this.addError(`${field.label} is required`);
            }
            return false;
        }
        
        // Validate based on field type
        let isValid = true;
        
        switch (field.validation) {
            case 'ein':
                isValid = /^\d{2}-\d{7}$/.test(value) || value === '';
                break;
            case 'ssn':
                isValid = /^\d{3}-\d{2}-\d{4}$/.test(value) || value === '';
                break;
            case 'phone':
                isValid = /^\(\d{3}\) \d{3}-\d{4}$/.test(value) || value === '';
                break;
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === '';
                break;
            case 'zip':
                isValid = /^\d{5}(-\d{4})?$/.test(value) || value === '';
                break;
            case 'currency':
                isValid = /^\d+(\.\d{2})?$/.test(value) || value === '';
                break;
            case 'number':
                isValid = /^\d+$/.test(value) || value === '';
                break;
            case 'percentage':
                isValid = /^\d+(\.\d+)?%$/.test(value) || value === '';
                break;
            case 'year':
                isValid = /^\d{4}$/.test(value) && parseInt(value) >= 2020 && parseInt(value) <= 2030 || value === '';
                break;
            case 'date':
                isValid = value !== '' && !isNaN(Date.parse(value));
                break;
            case 'required':
                isValid = true; // Just check if not empty, handled above
                break;
            default:
                isValid = true;
        }
        
        if (!isValid && value !== '') {
            container.classList.add('error');
            this.addError(`Invalid format for ${field.label}`);
            return false;
        }
        
        if (value && isValid) {
            container.classList.add('filled');
            if (this.formState === 'reviewed') {
                container.classList.add('success');
            }
            
            // Play ding sound for valid field entry
            this.playDingSound();
            
            // Add visual feedback animation
            container.classList.add('field-ding');
            setTimeout(() => {
                container.classList.remove('field-ding');
            }, 300);
        }
        
        return true;
    }
    
    addError(message) {
        if (!this.currentForm.errors.includes(message)) {
            this.currentForm.errors.push(message);
        }
    }
    
    clearErrors() {
        this.currentForm.errors = [];
    }
    
    updateRequirements() {
        const requirementsList = document.getElementById('requirements-list');
        const requiredFields = this.currentForm.fields.filter(field => field.required);
        
        let requirementsHTML = `
            <div class="tax-form-info">
                <div style="font-weight: bold; color: #2c3e50; margin-bottom: 8px;">
                    📋 ${this.currentForm.formNumber} - ${this.currentForm.state}
                </div>
                <div style="font-size: 11px; color: #7f8c8d; margin-bottom: 10px;">
                    ${this.getTaxFormDescription()}
                </div>
            </div>
        `;
        
        requirementsHTML += '<div style="font-weight: bold; margin-bottom: 8px; color: #e74c3c;">Required Fields:</div>';
        
        requiredFields.forEach((field, index) => {
            const fieldId = `field-${this.currentForm.fields.indexOf(field)}`;
            const isFilled = this.currentForm.filledFields[fieldId];
            const completedClass = isFilled ? 'completed' : '';
            
            requirementsHTML += `<div class="requirement ${completedClass}">
                ${isFilled ? '✅' : '📝'} ${field.label}
            </div>`;
        });
        
        requirementsHTML += '<div style="font-weight: bold; margin: 12px 0 6px; color: #2c3e50;">Filing Process:</div>';
        requirementsHTML += '<div style="font-size: 11px;">1. 🐼 Check PANDA Board for correct answers</div>';
        requirementsHTML += '<div style="font-size: 11px;">2. 🖊️ Click "Fill Form" to enable fields</div>';
        requirementsHTML += '<div style="font-size: 11px;">3. 📊 Copy data from PANDA to form fields</div>';
        requirementsHTML += '<div style="font-size: 11px;">4. 🔍 Click "Review Form" to validate</div>';
        requirementsHTML += '<div style="font-size: 11px;">5. 📤 Submit to tax authorities</div>';
        
        requirementsList.innerHTML = requirementsHTML;
    }
    
    getTaxFormDescription() {
        const descriptions = {
            '941': 'Federal quarterly employment tax return for employers reporting wages, tips, and tax withholdings.',
            'CA DE 9': 'California unemployment insurance and state disability insurance quarterly report.',
            'NYS-45': 'New York State quarterly combined withholding return for income tax and disability.',
            'C-3': 'Texas unemployment tax quarterly employer report for unemployment insurance contributions.',
            'UI-3/40': 'Illinois unemployment insurance quarterly wage and tax report for employers.',
            'RT-6': 'Florida quarterly unemployment compensation employer report and tax return.'
        };
        
        return descriptions[this.currentForm.formNumber] || 'Professional tax form requiring accurate completion and timely filing.';
    }
    
    updateActionButtons() {
        const fillBtn = document.getElementById('fill-btn');
        const reviewBtn = document.getElementById('review-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        if (!fillBtn || !reviewBtn || !submitBtn) {
            console.error('Action buttons not found!');
            return;
        }
        
        switch (this.formState) {
            case 'empty':
                fillBtn.disabled = false;
                reviewBtn.disabled = true;
                submitBtn.disabled = true;
                fillBtn.textContent = 'Fill Form';
                break;
            case 'filled':
                fillBtn.disabled = true;
                reviewBtn.disabled = false;
                submitBtn.disabled = true;
                break;
            case 'reviewed':
                fillBtn.disabled = true;
                reviewBtn.disabled = true;
                submitBtn.disabled = false;
                break;
        }
    }
    
    fillForm() {
        if (this.formState !== 'empty') {
            return;
        }
        
        this.formState = 'filled';
        this.renderForm();
        this.updateActionButtons();
        this.showCharacterMessage("Now enter the tax data accurately!", 2000);
        
        // Auto-focus first input
        const firstInput = document.querySelector('#current-form input, #current-form select');
        if (firstInput) {
            firstInput.focus();
        }
    }
    
    reviewForm() {
        if (this.formState !== 'filled') return;
        
        this.clearErrors();
        let allValid = true;
        let requiredFieldsFilled = 0;
        const totalRequiredFields = this.currentForm.fields.filter(field => field.required).length;
        
        // Validate all fields
        this.currentForm.fields.forEach((field, index) => {
            const fieldId = `field-${index}`;
            const isValid = this.validateField(fieldId, field);
            const value = this.currentForm.filledFields[fieldId];
            
            if (field.required && value) {
                requiredFieldsFilled++;
            }
            
            if (!isValid || (field.required && !value)) {
                allValid = false;
            }
        });
        
        if (requiredFieldsFilled < totalRequiredFields) {
            this.showCharacterMessage("You need to fill all required fields!", 3000);
            this.animateFormError();
            return;
        }
        
        if (!allValid) {
            this.showCharacterMessage("Please fix the errors before submitting!", 3000);
            this.animateFormError();
            return;
        }
        
        this.formState = 'reviewed';
        this.updateActionButtons();
        this.updateRequirements();
        this.showCharacterMessage("Great! Now submit it to the mailbox.", 2000);
        
        // Highlight mailbox
        const mailbox = document.getElementById('mailbox');
        if (mailbox) {
            mailbox.style.animation = 'none';
            setTimeout(() => {
                mailbox.style.animation = 'flagWave 1s ease-in-out 3';
            }, 100);
        }
    }
    
    submitForm() {
        if (this.formState !== 'reviewed') return;
        
        // Calculate accuracy
        let correctFields = 0;
        let totalScoredFields = 0;
        
        this.currentForm.fields.forEach((field, index) => {
            const fieldId = `field-${index}`;
            const value = this.currentForm.filledFields[fieldId];
            
            if (value && field.correct) {
                totalScoredFields++;
                // Flexible matching for different formats
                if (this.isAnswerCorrect(value, field.correct, field.validation)) {
                    correctFields++;
                }
            }
        });
        
        const accuracy = totalScoredFields > 0 ? (correctFields / totalScoredFields) : 0;
        const baseScore = 100;
        const accuracyBonus = Math.floor(accuracy * 50);
        const speedBonus = Math.floor(Math.max(0, this.timeLeft * 2));
        const totalFormScore = baseScore + accuracyBonus + speedBonus;
        
        this.score += totalFormScore;
        this.formsCompleted++;
        
        if (accuracy >= 0.8) {
            this.correctForms++;
            this.showCharacterMessage(`Perfect! +${totalFormScore} points!`, 2000);
            this.animateFormSuccess();
            this.playSuccessSound(); // Play success sound for perfect forms
        } else {
            this.showCharacterMessage(`Good try! +${totalFormScore} points`, 2000);
            this.playSuccessSound(); // Play success sound for completed forms
        }
        
        // Check level progression
        const formsNeededForNextLevel = this.level * 2;
        if (this.formsCompleted >= formsNeededForNextLevel) {
            this.levelUp();
        } else {
            setTimeout(() => {
                this.generateNewForm();
            }, 1500);
        }
        
        this.updateUI();
    }
    
    isAnswerCorrect(userValue, correctValue, validation) {
        // Normalize values for comparison
        const normalize = (val) => val.toString().toLowerCase().trim();
        
        // For currency fields, allow various formats
        if (validation === 'currency') {
            const userNum = parseFloat(userValue.replace(/[$,]/g, ''));
            const correctNum = parseFloat(correctValue.replace(/[$,]/g, ''));
            return Math.abs(userNum - correctNum) < 0.01;
        }
        
        // For phone numbers, allow various formats
        if (validation === 'phone') {
            const stripPhone = (phone) => phone.replace(/[\s\-\(\)]/g, '');
            return stripPhone(userValue) === stripPhone(correctValue);
        }
        
        return normalize(userValue) === normalize(correctValue);
    }
    
    levelUp() {
        this.level++;
        
        // Add bonus time
        this.timeLeft += 10;
        
        // Show level up message
        this.showCharacterMessage(`Level ${this.level}! +10 seconds bonus!`, 3000);
        
        // Play level up sound
        this.playLevelUpSound();
        
        // Reset timer color
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.style.background = '#dc3545';
            timerEl.style.animation = 'timerPulse 1s ease-in-out infinite';
        }
        
        // Make piggy sparkle for level up
        this.celebratePiggyLevelUp();
        
        setTimeout(() => {
            this.generateNewForm();
        }, 2000);
    }
    
    gameOver() {
        clearInterval(this.timer);
        this.gameState = 'gameOver';
        
        const accuracy = this.formsCompleted > 0 ? Math.round((this.correctForms / this.formsCompleted) * 100) : 0;
        
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('game-over-screen').style.display = 'block';
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-level').textContent = this.level;
        document.getElementById('final-forms').textContent = this.formsCompleted;
        document.getElementById('accuracy').textContent = accuracy + '%';
        
        // Determine rating
        let rating = '';
        let title = 'Time\'s Up!';
        
        if (accuracy >= 90 && this.score >= 1000) {
            rating = '⭐⭐⭐ TAX EXPERT!';
            title = 'Outstanding Work!';
        } else if (accuracy >= 70 && this.score >= 500) {
            rating = '⭐⭐ TAX PROFESSIONAL';
            title = 'Great Job!';
        } else if (accuracy >= 50 && this.score >= 200) {
            rating = '⭐ TAX APPRENTICE';
            title = 'Good Effort!';
        } else {
            rating = '📚 NEEDS PRACTICE';
            title = 'Keep Trying!';
        }
        
        document.getElementById('game-over-title').textContent = title;
        document.getElementById('rating').textContent = rating;
        
        // Stop background music on game over
        this.stopBackgroundMusic();
        
        // Update score and save to rankings
        this.updateScoreAndSave();
    }
    
    restartGame() {
        clearInterval(this.timer);
        this.startGame();
    }
    
    showStartScreen() {
        console.log('showStartScreen() called');
        clearInterval(this.timer);
        this.gameState = 'menu';
        this.updatePiggyVisibility();
        
        // Stop background music when returning to menu
        this.stopBackgroundMusic();
        
        // Hide all screens and show start screen
        const screens = ['profile-screen', 'rankings-screen', 'start-screen', 'game-screen', 'game-over-screen'];
        console.log('Switching screens...');
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                const displayValue = screenId === 'start-screen' ? 'flex' : 'none';
                screen.style.display = displayValue;
                console.log(`Set ${screenId} display to: ${displayValue}`);
            } else {
                console.log(`Screen not found: ${screenId}`);
            }
        });
        
        // Update current user display
        this.updateCurrentUserDisplay();
        console.log('Start screen transition complete');
    }
    
    updateUI() {
        const scoreEl = document.getElementById('score');
        const levelEl = document.getElementById('level');
        const timerEl = document.getElementById('timer');
        const completedEl = document.getElementById('completed');
        
        if (scoreEl) scoreEl.textContent = this.score;
        if (levelEl) levelEl.textContent = this.level;
        if (timerEl) timerEl.textContent = this.timeLeft;
        if (completedEl) completedEl.textContent = this.formsCompleted;
    }
    
    showCharacterMessage(message, duration = 3000) {
        const bubble = document.getElementById('speech-bubble');
        if (bubble) {
            bubble.textContent = message;
            bubble.classList.add('show');
            
            setTimeout(() => {
                bubble.classList.remove('show');
            }, duration);
        }
    }
    
    animateFormEntry() {
        const form = document.getElementById('current-form');
        form.classList.add('slide-in');
        setTimeout(() => {
            form.classList.remove('slide-in');
        }, 300);
    }
    
    animateFormSuccess() {
        const form = document.getElementById('current-form');
        form.style.background = 'rgba(46, 204, 113, 0.1)';
        form.style.border = '2px solid #27ae60';
        
        setTimeout(() => {
            form.style.background = 'white';
            form.style.border = '2px solid #333';
        }, 1000);
    }
    
    animateFormError() {
        const form = document.getElementById('current-form');
        form.classList.add('shake');
        setTimeout(() => {
            form.classList.remove('shake');
        }, 500);
    }
    
    setupTimerWarnings() {
        // Could add audio warnings here
        // For now, we use visual cues
    }
    
    initializeAudio() {
        // Initialize Web Audio Context for sound effects
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
        
        // Setup audio controls
        this.setupAudioControls();
        
        // Initialize synthetic music system
        this.setupBackgroundMusic();
        
        // Add click listener to start audio on any user interaction
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }
    
    setupAudioControls() {
        const musicToggle = document.getElementById('music-toggle');
        const sfxToggle = document.getElementById('sfx-toggle');
        const volumeSlider = document.getElementById('volume-slider');
        
        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                this.toggleMusic();
            });
        }
        
        if (sfxToggle) {
            sfxToggle.addEventListener('click', () => {
                this.toggleSFX();
            });
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }
    }
    
    setupBackgroundMusic() {
        // Create synthetic background music using Web Audio API
        this.musicNodes = null;
        this.musicStarted = false;
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        const musicToggle = document.getElementById('music-toggle');
        
        if (musicToggle) {
            if (this.musicEnabled) {
                musicToggle.classList.remove('muted');
                musicToggle.textContent = '🎵';
                if (this.gameState === 'playing') {
                    this.startBackgroundMusic();
                }
            } else {
                musicToggle.classList.add('muted');
                musicToggle.textContent = '🔇';
                this.stopBackgroundMusic();
            }
        }
    }
    
    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        const sfxToggle = document.getElementById('sfx-toggle');
        
        if (sfxToggle) {
            if (this.sfxEnabled) {
                sfxToggle.classList.remove('muted');
                sfxToggle.textContent = '🔊';
            } else {
                sfxToggle.classList.add('muted');
                sfxToggle.textContent = '🔇';
            }
        }
    }
    
    setVolume(volume) {
        this.volume = volume;
        
        // Update synthetic music volume if playing
        if (this.musicNodes && this.musicNodes.gainNode) {
            this.musicNodes.gainNode.gain.setValueAtTime(this.volume * 0.15, this.audioContext.currentTime);
        }
    }
    
    // Create ding sound effect using Web Audio API
    playDingSound() {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        try {
            // Create a simple pleasant ding sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Create a bell-like ding sound
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.type = 'sine';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Could not play ding sound:', e);
        }
    }
    
    // Play success sound for form submission
    playSuccessSound() {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        try {
            // Create a triumphant success sound
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
            let delay = 0;
            
            frequencies.forEach((freq, index) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                
                osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + delay);
                gain.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
                gain.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + delay + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + delay + 0.5);
                
                osc.type = 'sine';
                osc.start(this.audioContext.currentTime + delay);
                osc.stop(this.audioContext.currentTime + delay + 0.5);
                
                delay += 0.1;
            });
        } catch (e) {
            console.log('Could not play success sound:', e);
        }
    }
    
    // Play level up sound
    playLevelUpSound() {
        if (!this.sfxEnabled || !this.audioContext) return;
        
        try {
            // Create an ascending celebratory sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.4, this.audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
            
            oscillator.type = 'triangle';
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Could not play level up sound:', e);
        }
    }
    
    // Create and start synthetic background music
    startBackgroundMusic() {
        if (!this.musicEnabled || !this.audioContext || this.musicStarted) return;
        
        try {
            this.musicStarted = true;
            this.createSyntheticMusic();
        } catch (e) {
            console.log('Could not start background music:', e);
        }
    }
    
    stopBackgroundMusic() {
        if (this.musicNodes) {
            // Stop all music nodes
            Object.values(this.musicNodes).forEach(node => {
                if (node && node.stop) {
                    node.stop();
                } else if (node && node.disconnect) {
                    node.disconnect();
                }
            });
            this.musicNodes = null;
        }
        this.musicStarted = false;
    }
    
    createSyntheticMusic() {
        if (!this.audioContext) return;
        
        // Create upbeat Mario-style background music
        const gainNode = this.audioContext.createGain();
        gainNode.connect(this.audioContext.destination);
        gainNode.gain.setValueAtTime(this.volume * 0.2, this.audioContext.currentTime);
        
        this.musicNodes = { gainNode };
        
        // Mario-style melody in C major (upbeat and bouncy)
        const melody = [
            { note: 523.25, duration: 0.3 }, // C5
            { note: 523.25, duration: 0.3 }, // C5
            { note: 0, duration: 0.2 },      // Rest
            { note: 523.25, duration: 0.3 }, // C5
            { note: 0, duration: 0.2 },      // Rest
            { note: 415.30, duration: 0.3 }, // G#4
            { note: 523.25, duration: 0.4 }, // C5
            { note: 0, duration: 0.3 },      // Rest
            { note: 659.25, duration: 0.6 }, // E5
            { note: 0, duration: 0.6 },      // Rest
            { note: 329.63, duration: 0.6 }, // E4
            { note: 0, duration: 0.6 },      // Rest
            
            { note: 392.00, duration: 0.4 }, // G4
            { note: 0, duration: 0.2 },      // Rest
            { note: 311.13, duration: 0.4 }, // D#4
            { note: 0, duration: 0.2 },      // Rest
            { note: 349.23, duration: 0.4 }, // F4
            { note: 369.99, duration: 0.4 }, // F#4
            { note: 329.63, duration: 0.4 }, // E4
            { note: 0, duration: 0.2 },      // Rest
            
            { note: 261.63, duration: 0.4 }, // C4
            { note: 392.00, duration: 0.4 }, // G4
            { note: 523.25, duration: 0.4 }, // C5
            { note: 440.00, duration: 0.4 }, // A4
            { note: 493.88, duration: 0.4 }, // B4
            { note: 466.16, duration: 0.2 }, // A#4
            { note: 440.00, duration: 0.4 }, // A4
            { note: 0, duration: 0.2 },      // Rest
        ];
        
        // Bass line pattern (bouncy like Mario)
        const bassLine = [
            { note: 130.81, duration: 0.4 }, // C3
            { note: 0, duration: 0.2 },      // Rest
            { note: 196.00, duration: 0.4 }, // G3
            { note: 0, duration: 0.2 },      // Rest
            { note: 164.81, duration: 0.4 }, // E3
            { note: 0, duration: 0.2 },      // Rest
            { note: 220.00, duration: 0.4 }, // A3
            { note: 0, duration: 0.2 },      // Rest
        ];
        
        let melodyIndex = 0;
        let bassIndex = 0;
        let startTime = this.audioContext.currentTime;
        
        const playMelodyNote = (noteTime) => {
            if (!this.musicEnabled || !this.musicNodes) return;
            
            const note = melody[melodyIndex % melody.length];
            
            if (note.note > 0) { // Not a rest
                const osc = this.audioContext.createOscillator();
                const noteGain = this.audioContext.createGain();
                
                osc.connect(noteGain);
                noteGain.connect(gainNode);
                
                osc.frequency.setValueAtTime(note.note, noteTime);
                osc.type = 'square'; // Classic 8-bit square wave sound
                
                // Sharp attack and decay for that classic video game sound
                noteGain.gain.setValueAtTime(0, noteTime);
                noteGain.gain.linearRampToValueAtTime(0.15, noteTime + 0.01);
                noteGain.gain.linearRampToValueAtTime(0.1, noteTime + note.duration * 0.7);
                noteGain.gain.linearRampToValueAtTime(0, noteTime + note.duration);
                
                osc.start(noteTime);
                osc.stop(noteTime + note.duration);
            }
            
            melodyIndex++;
            
            // Schedule next note
            setTimeout(() => {
                if (this.musicEnabled && this.musicNodes) {
                    playMelodyNote(this.audioContext.currentTime);
                }
            }, note.duration * 1000);
        };
        
        const playBassNote = (noteTime) => {
            if (!this.musicEnabled || !this.musicNodes) return;
            
            const note = bassLine[bassIndex % bassLine.length];
            
            if (note.note > 0) { // Not a rest
                const bassOsc = this.audioContext.createOscillator();
                const bassGain = this.audioContext.createGain();
                
                bassOsc.connect(bassGain);
                bassGain.connect(gainNode);
                
                bassOsc.frequency.setValueAtTime(note.note, noteTime);
                bassOsc.type = 'triangle'; // Warmer bass sound
                
                // Punchy bass attack
                bassGain.gain.setValueAtTime(0, noteTime);
                bassGain.gain.linearRampToValueAtTime(0.08, noteTime + 0.02);
                bassGain.gain.linearRampToValueAtTime(0.05, noteTime + note.duration * 0.6);
                bassGain.gain.linearRampToValueAtTime(0, noteTime + note.duration);
                
                bassOsc.start(noteTime);
                bassOsc.stop(noteTime + note.duration);
            }
            
            bassIndex++;
            
            // Schedule next bass note
            setTimeout(() => {
                if (this.musicEnabled && this.musicNodes) {
                    playBassNote(this.audioContext.currentTime);
                }
            }, note.duration * 1000);
        };
        
        // Start melody and bass
        playMelodyNote(startTime + 0.1);
        playBassNote(startTime + 0.1);
        
        // Add occasional drum-like percussion using noise
        const addPercussion = () => {
            if (!this.musicEnabled || !this.musicNodes) return;
            
            // Create a short burst of filtered white noise for percussion
            const bufferSize = this.audioContext.sampleRate * 0.1; // 0.1 seconds
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            // Generate white noise
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const noise = this.audioContext.createBufferSource();
            const noiseGain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            noise.buffer = buffer;
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(gainNode);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, this.audioContext.currentTime);
            
            noiseGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            noiseGain.gain.linearRampToValueAtTime(0.03, this.audioContext.currentTime + 0.01);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
            
            noise.start(this.audioContext.currentTime);
            noise.stop(this.audioContext.currentTime + 0.1);
            
            // Schedule next percussion hit
            setTimeout(() => {
                if (this.musicEnabled && this.musicNodes) {
                    addPercussion();
                }
            }, 1600); // Every 1.6 seconds (on beat)
        };
        
        // Start percussion after a delay
        setTimeout(() => {
            if (this.musicEnabled && this.musicNodes) {
                addPercussion();
            }
        }, 800);
    }
    
    setupPiggyInteractions() {
        // Setup interactions for all piggy characters
        const piggies = ['beach-piggy', 'penny-piggy', 'business-piggy', 'party-piggy'];
        piggies.forEach(piggyId => {
            const piggy = document.getElementById(piggyId);
            if (piggy) {
                piggy.addEventListener('click', () => {
                    this.handlePiggyClick(piggyId);
                });
            }
        });
        
        // Show different piggies based on game state
        this.updatePiggyVisibility();
    }
    
    handlePiggyClick(piggyId) {
        if (this.gameState !== 'playing') return;
        
        // Different bonuses for different piggies
        const piggyBonuses = {
            'beach-piggy': { points: 15, time: 2, message: 'Vacation vibes! Relaxed bonus!' },
            'penny-piggy': { points: 25, time: 3, message: 'Lucky penny! Classic bonus!' },
            'business-piggy': { points: 35, time: 5, message: 'Professional bonus! Work hard!' },
            'party-piggy': { points: 50, time: 8, message: 'Celebration bonus! Party time!' }
        };
        
        const bonus = piggyBonuses[piggyId] || piggyBonuses['penny-piggy'];
        
        // Add bonus points and time
        this.score += bonus.points;
        this.timeLeft += bonus.time;
        
        // Show celebration message
        this.showCharacterMessage(bonus.message, 2000);
        
        // Update UI
        this.updateUI();
        
        // Add special animation to piggy
        this.animatePiggyBonus(piggyId);
        
        // Play some visual feedback
        this.showBonusEffect(bonus.points, piggyId);
    }
    
    updatePiggyVisibility() {
        // Show different piggies based on game state and level
        const beachPiggy = document.getElementById('beach-piggy');
        const pennyPiggy = document.getElementById('penny-piggy');
        const businessPiggy = document.getElementById('business-piggy');
        const partyPiggy = document.getElementById('party-piggy');
        
        if (!this.gameState || this.gameState === 'menu') {
            // Show some piggies on menu screen for decoration
            if (beachPiggy) beachPiggy.style.opacity = '1';
            if (pennyPiggy) pennyPiggy.style.opacity = '1';
            if (businessPiggy) businessPiggy.style.opacity = '0.7';
            if (partyPiggy) partyPiggy.style.opacity = '0';
            return;
        }
        
        // Show piggies based on level progression during gameplay
        if (beachPiggy) beachPiggy.style.opacity = '1'; // Always visible
        if (pennyPiggy) pennyPiggy.style.opacity = this.level >= 1 ? '1' : '0.5';
        if (businessPiggy) businessPiggy.style.opacity = this.level >= 3 ? '1' : '0.7';
        if (partyPiggy) partyPiggy.style.opacity = '0'; // Only shows during celebrations
    }
    
    animatePiggyBonus(piggyId) {
        const piggy = document.getElementById(piggyId);
        if (piggy) {
            const originalAnimation = piggy.style.animation;
            piggy.style.animation = 'none';
            setTimeout(() => {
                piggy.style.animation = originalAnimation + ', piggyBonusJump 0.6s ease-out';
            }, 50);
            
            setTimeout(() => {
                piggy.style.animation = originalAnimation;
            }, 600);
        }
    }
    
    showBonusEffect(points, piggyId) {
        // Create floating bonus effect
        const piggy = document.getElementById(piggyId);
        if (!piggy) return;
        
        const rect = piggy.getBoundingClientRect();
        const bonusEl = document.createElement('div');
        bonusEl.className = 'bonus-points';
        bonusEl.textContent = '+' + points;
        bonusEl.style.position = 'absolute';
        bonusEl.style.top = (rect.top - 80) + 'px';
        bonusEl.style.left = (rect.left + rect.width/2 - 20) + 'px';
        bonusEl.style.color = '#FFD700';
        bonusEl.style.fontSize = '24px';
        bonusEl.style.fontWeight = 'bold';
        bonusEl.style.zIndex = '100';
        bonusEl.style.animation = 'bonusFloat 2s ease-out forwards';
        bonusEl.style.pointerEvents = 'none';
        bonusEl.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        
        document.body.appendChild(bonusEl);
        
        setTimeout(() => {
            if (bonusEl.parentNode) {
                bonusEl.parentNode.removeChild(bonusEl);
            }
        }, 2000);
    }
    
    celebratePiggyLevelUp() {
        // Show party piggy for celebration
        const partyPiggy = document.getElementById('party-piggy');
        if (partyPiggy) {
            partyPiggy.style.opacity = '1';
            partyPiggy.classList.add('level-up');
            
            setTimeout(() => {
                partyPiggy.style.opacity = '0';
                partyPiggy.classList.remove('level-up');
            }, 4000);
        }
        
        // Add sparkle effect to all visible piggies
        const allPiggies = ['beach-piggy', 'penny-piggy', 'business-piggy'];
        allPiggies.forEach(piggyId => {
            const piggy = document.getElementById(piggyId);
            if (piggy && piggy.style.opacity !== '0') {
                piggy.classList.add('level-up');
                setTimeout(() => {
                    piggy.classList.remove('level-up');
                }, 3000);
            }
        });
        
        // Update piggy visibility for new level
        setTimeout(() => {
            this.updatePiggyVisibility();
        }, 500);
    }
    
    // User Profile Management
    initializeUserProfile() {
        this.loadUserProfile();
        this.showInitialScreen();
    }
    
    setupAvatarSelection() {
        console.log('Setting up avatar selection...');
        const avatarOptions = document.querySelectorAll('.avatar-option');
        const playerNameInput = document.getElementById('player-name');
        
        console.log('Found', avatarOptions.length, 'avatar options');
        
        // Set up avatar clicks
        avatarOptions.forEach((option, index) => {
            console.log(`Setting up avatar ${index}:`, option.dataset.avatar);
            
            // Clear any existing onclick handlers
            option.onclick = null;
            
            // Add new onclick handler
            option.onclick = (event) => {
                event.preventDefault();
                console.log('Avatar clicked:', option.dataset.avatar);
                
                // Remove selection from all
                avatarOptions.forEach(opt => {
                    opt.classList.remove('selected');
                    opt.style.border = '3px solid transparent';
                });
                
                // Add selection to clicked
                option.classList.add('selected');
                option.style.border = '3px solid #FFD700';
                option.style.boxShadow = '0 0 20px rgba(255,215,0,0.5)';
                
                this.selectedAvatar = option.dataset.avatar;
                console.log('Selected avatar set to:', this.selectedAvatar);
                
                this.checkProfileReadiness();
            };
        });
        
        // Set up name input
        if (playerNameInput) {
            playerNameInput.oninput = () => {
                console.log('Name input:', playerNameInput.value);
                this.checkProfileReadiness();
            };
        } else {
            console.log('Player name input not found!');
        }
        
        console.log('Avatar selection setup complete');
    }
    
    checkProfileReadiness() {
        const playerName = document.getElementById('player-name')?.value?.trim();
        const createProfileBtn = document.querySelector('.create-profile-btn');
        
        console.log('Checking profile readiness:');
        console.log('- Player name:', `"${playerName}"`);
        console.log('- Selected avatar:', this.selectedAvatar);
        console.log('- Create profile button:', !!createProfileBtn);
        
        if (createProfileBtn) {
            if (playerName && this.selectedAvatar) {
                console.log('✅ Profile is ready!');
                createProfileBtn.disabled = false;
                createProfileBtn.style.opacity = '1';
                createProfileBtn.style.background = 'linear-gradient(45deg, #66BB6A, #4CAF50)';
                createProfileBtn.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                createProfileBtn.style.cursor = 'pointer';
            } else {
                console.log('❌ Profile not ready');
                createProfileBtn.disabled = true;
                createProfileBtn.style.opacity = '0.6';
                createProfileBtn.style.background = '#ccc';
                createProfileBtn.style.boxShadow = 'none';
                createProfileBtn.style.cursor = 'not-allowed';
            }
        } else {
            console.log('❌ Create profile button not found!');
        }
    }
    
    loadUserProfile() {
        try {
            const savedUser = localStorage.getItem('taxProUser');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        } catch (e) {
            console.log('No saved user profile found');
        }
    }
    
    saveUserProfile() {
        if (this.currentUser) {
            localStorage.setItem('taxProUser', JSON.stringify(this.currentUser));
            this.updateRankings();
        }
    }
    
    createUserProfile() {
        const playerName = document.getElementById('player-name')?.value?.trim();
        
        console.log('Game createUserProfile called');
        console.log('Player name:', playerName);
        console.log('Selected avatar:', this.selectedAvatar);
        
        if (!playerName || !this.selectedAvatar) {
            alert('Please enter your name and select an avatar!');
            return;
        }
        
        this.currentUser = {
            name: playerName,
            avatar: this.selectedAvatar,
            bestScore: 0,
            totalGames: 0,
            dateCreated: new Date().toISOString()
        };
        
        console.log('User profile created:', this.currentUser);
        
        this.saveUserProfile();
        this.updateCurrentUserDisplay();
        
        console.log('About to show start screen...');
        this.showStartScreen();
        console.log('Start screen should now be visible');
    }
    
    updateCurrentUserDisplay() {
        if (!this.currentUser) return;
        
        const userNameEl = document.getElementById('current-user-name');
        const userBestEl = document.getElementById('current-user-best');
        const userAvatarEl = document.getElementById('current-user-avatar');
        
        if (userNameEl) userNameEl.textContent = this.currentUser.name;
        if (userBestEl) userBestEl.textContent = this.currentUser.bestScore.toLocaleString();
        if (userAvatarEl) {
            userAvatarEl.innerHTML = this.createAvatarHTML(this.currentUser.avatar);
        }
    }
    
    createAvatarHTML(avatarType) {
        const baseHTML = `
            <div class="piggy-body">
                <div class="piggy-head">
                    <div class="piggy-ear ear-left"></div>
                    <div class="piggy-ear ear-right"></div>
                    <div class="piggy-eye eye-left"></div>
                    <div class="piggy-eye eye-right"></div>
                    <div class="piggy-snout"></div>
                </div>
                <div class="piggy-legs">
                    <div class="piggy-leg"></div>
                    <div class="piggy-leg"></div>
                    <div class="piggy-leg"></div>
                    <div class="piggy-leg"></div>
                </div>
                <div class="piggy-tail"></div>
            </div>
        `;
        
        let accessoryHTML = '';
        switch (avatarType) {
            case 'beach':
                accessoryHTML = `
                    <div class="beach-umbrella">
                        <div class="umbrella-pole"></div>
                        <div class="umbrella-top"></div>
                    </div>
                `;
                break;
            case 'penny':
                accessoryHTML = `
                    <div class="penny-coin">
                        <div class="coin-inner">¢</div>
                    </div>
                `;
                break;
            case 'business':
                accessoryHTML = `
                    <div class="briefcase">
                        <div class="briefcase-body"></div>
                        <div class="briefcase-handle"></div>
                    </div>
                `;
                break;
            case 'party':
                accessoryHTML = `
                    <div class="party-decorations">
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                        <div class="confetti"></div>
                    </div>
                `;
                break;
        }
        
        return baseHTML + accessoryHTML;
    }
    
    updateRankings() {
        if (!this.currentUser) return;
        
        let rankings = this.getRankings();
        
        // Find existing user or add new one
        const existingIndex = rankings.findIndex(user => user.name === this.currentUser.name);
        
        if (existingIndex >= 0) {
            // Update existing user's best score if current is better
            if (this.score > rankings[existingIndex].bestScore) {
                rankings[existingIndex].bestScore = this.score;
                rankings[existingIndex].lastPlayed = new Date().toISOString();
            }
            rankings[existingIndex].totalGames++;
        } else {
            // Add new user to rankings
            rankings.push({
                name: this.currentUser.name,
                avatar: this.currentUser.avatar,
                bestScore: this.currentUser.bestScore,
                totalGames: this.currentUser.totalGames,
                lastPlayed: new Date().toISOString()
            });
        }
        
        // Sort by best score (descending) and keep top 50
        rankings.sort((a, b) => b.bestScore - a.bestScore);
        rankings = rankings.slice(0, 50);
        
        localStorage.setItem('redRockRankings', JSON.stringify(rankings));
    }
    
    getRankings() {
        try {
            const saved = localStorage.getItem('redRockRankings');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }
    
    showInitialScreen() {
        if (this.currentUser) {
            this.updateCurrentUserDisplay();
            this.showStartScreen();
        } else {
            this.showProfileScreen();
        }
    }
    
    showProfileScreen() {
        const screens = ['profile-screen', 'rankings-screen', 'start-screen', 'game-screen', 'game-over-screen'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.style.display = screenId === 'profile-screen' ? 'flex' : 'none';
            }
        });
        
        // Setup avatar selection immediately
        this.setupAvatarSelection();
    }
    
    showRankingsScreen() {
        const screens = ['profile-screen', 'rankings-screen', 'start-screen', 'game-screen', 'game-over-screen'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.style.display = screenId === 'rankings-screen' ? 'flex' : 'none';
            }
        });
        
        this.displayRankings();
    }
    
    displayRankings() {
        const rankingsList = document.getElementById('rankings-list');
        if (!rankingsList) return;
        
        const rankings = this.getRankings();
        
        if (rankings.length === 0) {
            rankingsList.innerHTML = `
                <div style="text-align: center; color: rgba(255,255,255,0.7); font-style: italic;">
                    No rankings yet! Be the first to play and set a high score!
                </div>
            `;
            return;
        }
        
        rankingsList.innerHTML = rankings.map((user, index) => {
            const position = index + 1;
            const positionClass = position === 1 ? 'first' : position === 2 ? 'second' : position === 3 ? 'third' : '';
            const isCurrentUser = this.currentUser && user.name === this.currentUser.name;
            
            return `
                <div class="ranking-entry ${isCurrentUser ? 'current-user' : ''}">
                    <div class="ranking-position ${positionClass}">#${position}</div>
                    <div class="ranking-player">
                        <div class="ranking-avatar">${this.createAvatarHTML(user.avatar)}</div>
                        <div class="ranking-name">${user.name}</div>
                    </div>
                    <div class="ranking-score">${user.bestScore.toLocaleString()}</div>
                </div>
            `;
        }).join('');
    }
    
    updateScoreAndSave() {
        if (this.currentUser) {
            if (this.score > this.currentUser.bestScore) {
                this.currentUser.bestScore = this.score;
                this.updateCurrentUserDisplay();
            }
            this.currentUser.totalGames++;
            this.saveUserProfile();
        }
    }
}

// Global game instance and functions
let game;

function startGame() {
    if (game) {
        game.startGame();
    } else {
        console.error('Game object not found!');
    }
}

function forceStartGame() {
    console.log('FORCE START - Direct DOM manipulation');
    
    // Hide all screens
    const screens = ['profile-screen', 'rankings-screen', 'start-screen', 'game-over-screen'];
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'none';
        }
    });
    
    // Show game screen
    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.style.display = 'flex';
        console.log('Game screen shown');
        
        // Try to initialize basic game state
        if (game && game.generateNewForm) {
            console.log('Initializing game with form...');
            try {
                game.gameState = 'playing';
                game.level = 1;
                game.score = 0;
                game.generateNewForm();
                game.startBackgroundMusic();
                console.log('Game force-started successfully!');
            } catch (error) {
                console.error('Error in force start:', error);
            }
        } else {
            console.log('Game object not ready, showing basic game screen');
        }
    } else {
        console.error('Game screen not found!');
    }
}

function fillForm() {
    if (game) {
        game.fillForm();
    }
}

function reviewForm() {
    if (game) game.reviewForm();
}

function submitForm() {
    if (game) game.submitForm();
}

function restartGame() {
    if (game) game.restartGame();
}

function showStartScreen() {
    if (game) game.showStartScreen();
}

// Profile management functions
function createUserProfile() {
    console.log('🚀 createUserProfile() clicked!');
    
    const nameInput = document.getElementById('player-name');
    const playerName = nameInput ? nameInput.value.trim() : '';
    
    console.log('📋 Profile Creation Debug:');
    console.log('  - Name input element:', !!nameInput);
    console.log('  - Raw name value:', `"${nameInput?.value}"`);
    console.log('  - Trimmed name:', `"${playerName}"`);
    console.log('  - Name length:', playerName.length);
    console.log('  - Name is truthy:', !!playerName);
    console.log('  - selectedAvatarGlobal:', selectedAvatarGlobal);
    console.log('  - Avatar is truthy:', !!selectedAvatarGlobal);
    console.log('  - Game object exists:', !!game);
    
    if (playerName && selectedAvatarGlobal) {
        console.log('✅ Both name and avatar present, proceeding...');
        // Update game object
        if (game) {
            console.log('Setting game.selectedAvatar to:', selectedAvatarGlobal);
            game.selectedAvatar = selectedAvatarGlobal;
            console.log('Calling game.createUserProfile()...');
            game.createUserProfile();
        } else {
            console.log('Game object not found, creating simple profile...');
            // Create a simple profile without game object
            localStorage.setItem('taxProUser', JSON.stringify({
                name: playerName,
                avatar: selectedAvatarGlobal,
                bestScore: 0
            }));
            
            // Show start screen
            const screens = ['profile-screen', 'start-screen', 'game-screen', 'rankings-screen'];
            screens.forEach(screenId => {
                const screen = document.getElementById(screenId);
                if (screen) {
                    screen.style.display = screenId === 'start-screen' ? 'flex' : 'none';
                }
            });
        }
    } else {
        console.log('❌ VALIDATION FAILED:');
        console.log('  - playerName:', `"${playerName}"`, '(truthy:', !!playerName, ')');
        console.log('  - selectedAvatarGlobal:', selectedAvatarGlobal, '(truthy:', !!selectedAvatarGlobal, ')');
        console.error('🚨 Alert will be shown because validation failed');
        alert('Please enter your name and select an avatar!');
    }
}

function showRankings() {
    if (game) game.showRankingsScreen();
}

function showProfileScreen() {
    if (game) game.showProfileScreen();
}

function startGameFromRankings() {
    if (game) {
        game.showStartScreen();
    }
}

// PANDA Board functions
function togglePandaBoard() {
    const pandaBoard = document.querySelector('.panda-board');
    const minimizeBtn = document.getElementById('panda-minimize');
    
    if (pandaBoard && minimizeBtn) {
        if (pandaBoard.classList.contains('minimized')) {
            pandaBoard.classList.remove('minimized');
            minimizeBtn.textContent = '📋 Minimize';
        } else {
            pandaBoard.classList.add('minimized');
            minimizeBtn.textContent = '📋 Show PANDA';
        }
    }
}


// Global avatar selection function for direct HTML onclick
let selectedAvatarGlobal = null;

function selectAvatar(avatarType, element) {
    console.log('🎯 selectAvatar() called with:', avatarType);
    console.log('Element clicked:', element);
    
    // Clear all selections
    const allAvatars = document.querySelectorAll('.avatar-option');
    console.log('Found', allAvatars.length, 'avatar options');
    allAvatars.forEach(av => {
        av.style.border = '5px solid red';
        av.style.backgroundColor = 'rgba(255,0,0,0.1)';
    });
    
    // Highlight selected
    element.style.border = '5px solid #FFD700';
    element.style.backgroundColor = 'rgba(255,215,0,0.3)';
    
    selectedAvatarGlobal = avatarType;
    console.log('✅ selectedAvatarGlobal set to:', selectedAvatarGlobal);
    
    // Update game object if it exists
    if (window.game && window.game.selectedAvatar !== undefined) {
        window.game.selectedAvatar = avatarType;
        window.game.checkProfileReadiness();
    }
    
    // Direct button update
    const createBtn = document.querySelector('.create-profile-btn');
    const nameInput = document.getElementById('player-name');
    
    console.log('Checking button state...');
    console.log('Create button exists:', !!createBtn);
    console.log('Name input exists:', !!nameInput);
    console.log('Name value:', nameInput?.value);
    console.log('selectedAvatarGlobal:', selectedAvatarGlobal);
    
    if (createBtn && nameInput && nameInput.value.trim() && selectedAvatarGlobal) {
        createBtn.disabled = false;
        createBtn.style.background = '#4CAF50';
        createBtn.style.opacity = '1';
        console.log('✅ Profile is ready! Button enabled.');
    } else {
        console.log('❌ Profile not ready yet');
    }
}

// Function to check if profile is ready (called from name input)
function checkProfileReady() {
    console.log('DIRECT INPUT - Name changed');
    const createBtn = document.querySelector('.create-profile-btn');
    const nameInput = document.getElementById('player-name');
    
    if (createBtn && nameInput && nameInput.value.trim() && selectedAvatarGlobal) {
        createBtn.disabled = false;
        createBtn.style.background = '#4CAF50';
        createBtn.style.opacity = '1';
        console.log('Profile is ready from name input!');
    } else {
        createBtn.disabled = true;
        createBtn.style.background = '#ccc';
        createBtn.style.opacity = '0.6';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    game = new TaxFilingGame();
    console.log('Game object created:', !!game);
});

// Add some keyboard shortcuts for better gameplay
document.addEventListener('keydown', (event) => {
    // ESC key works globally to exit to main menu
    if (event.key === 'Escape') {
        showStartScreen();
        return;
    }
    
    // Other shortcuts only work during gameplay
    if (!game || game.gameState !== 'playing') return;
    
    switch (event.key) {
        case '1':
            const fillBtn = document.getElementById('fill-btn');
            if (fillBtn && !fillBtn.disabled) {
                fillForm();
            }
            break;
        case '2':
            const reviewBtn = document.getElementById('review-btn');
            if (reviewBtn && !reviewBtn.disabled) {
                reviewForm();
            }
            break;
        case '3':
        case 'Enter':
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn && !submitBtn.disabled) {
                submitForm();
            }
            break;
    }
});

// Prevent form submission on Enter key in inputs
document.addEventListener('keypress', (event) => {
    if (event.target.tagName === 'INPUT' && event.key === 'Enter') {
        event.preventDefault();
        // Move to next input or review if last input
        const inputs = Array.from(document.querySelectorAll('#current-form input, #current-form select'));
        const currentIndex = inputs.indexOf(event.target);
        if (currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        } else {
            reviewForm();
        }
    }
});

// Auto-save game progress (basic implementation)
window.addEventListener('beforeunload', () => {
    if (game && game.gameState === 'playing') {
        localStorage.setItem('taxGameProgress', JSON.stringify({
            level: game.level,
            score: game.score,
            formsCompleted: game.formsCompleted,
            timeLeft: game.timeLeft
        }));
    }
});
