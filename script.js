let q4Value = "";

let q4aIsYes = false;
let q4bIsYes = false;

// Define a mapping from page IDs to simplified step category IDs
const pageToStepMap = {
    'welcome': 'step-welcome',
    'eligibility': 'step-eligibility-category',
    'eligibility-success': 'step-eligibility-category', // Maps to the same category
    'basic-details': 'step-personal-details-category',
    'commitment-kaupapa': 'step-education-experience-category', 
    'school-referral-details': 'step-education-experience-category', // Maps to the same category
    'cv-education': 'step-education-experience-category',
    'preferred-subjects': 'step-teaching-preferences-category',
    'locations': 'step-teaching-preferences-category',
    'review-application': 'step-review-submit-category',
    'confirmation': 'step-review-submit-category' // Maps to the same category
};



function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    // Determine the active step category ID
    const activeStepCategoryId = pageToStepMap[pageId];

    // Update progress steps
    const allSteps = document.querySelectorAll('.step');
    allSteps.forEach(step => {
        step.classList.remove('active');
        step.classList.remove('completed'); // Clear any previous 'completed' states
    });

    const currentStepElement = document.getElementById(activeStepCategoryId);

    if (currentStepElement) {
        currentStepElement.classList.add('active');

        // Mark previous steps as 'completed'
        let foundCurrent = false;
        allSteps.forEach(step => {
            if (step === currentStepElement) {
                foundCurrent = true;
            } else if (!foundCurrent) {
                step.classList.add('completed');
            }
        });
    }

    if (pageId === 'review-application') {
        displaySummary();
    }
}

function toggleRegistrationQuestion() {
    const q2Yes = document.querySelector('input[name="q2"][value="yes"]');
    const registrationGroup = document.getElementById('q2-group-container');
    if (q2Yes && q2Yes.checked) {
        registrationGroup.style.display = 'block';
    } else {
        registrationGroup.style.display = 'none';
    }
}

function checkEligibility() {
    const messageDisplay = document.getElementById('eligibility-message-display');

    // Clear previous messages and reset style
    if (messageDisplay) {
        messageDisplay.innerHTML = '';
        messageDisplay.className = 'message-area'; // Reset to default class
    }

    const q2Yes = document.querySelector('input[name="q2"][value="yes"]');
    const registrationStatusGroup = document.getElementById('q2-group-container'); // Ensure this ID is correct as per previous discussions
    const registrationYesRadio = registrationStatusGroup ? registrationStatusGroup.querySelector('input[name="registration"][value="yes"]') : null;

    const residencyNone = document.querySelector('input[name="q3"][value="none"]');
    const q5Yes = document.querySelector('input[name="q5"][value="yes"]');

    q4aIsYes = document.querySelector('input[name="q4a"][value="yes"]:checked') ? true : false;
    q4bIsYes = document.querySelector('input[name="q4b"][value="yes"]:checked') ? true : false;

    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    const q5 = document.querySelector('input[name="q5"]:checked');
    const q4a = document.querySelector('input[name="q4a"]:checked');
    const q4b = document.querySelector('input[name="q4b"]:checked');

    // Helper function to show messages
    function showMessage(text, type = 'error') {
        if (messageDisplay) {
            messageDisplay.textContent = text;
            messageDisplay.classList.add(type === 'error' ? 'message-error' : 'message-success');
        }
    }

    if (!q2 || !q3 || !q5 || !q4a || !q4b) {
        showMessage('Please answer all eligibility questions.');
        return;
    }

    if (q2Yes && q2Yes.checked) {
        const registrationAnswered = registrationStatusGroup ? registrationStatusGroup.querySelector('input[name="registration"]:checked') : null;
        if (registrationStatusGroup.style.display === 'block' && !registrationAnswered) {
            showMessage('Please answer the question regarding your NZ teaching registration status.');
            return;
        }

        if (registrationYesRadio && registrationYesRadio.checked) {
            showMessage('Based on your answers, as you have completed a teaching qualification and are already registered to teach in New Zealand, you may not be eligible for this specific pathway. Please contact us to discuss your situation.');
            return;
        }
    }

    if (residencyNone && residencyNone.checked) {
        showMessage('To be eligible, you must be an NZ Citizen or NZ Resident.');
        return;
    }
    if (!q5Yes || !q5Yes.checked) {
        showMessage('To be eligible, you must have completed a Bachelor’s degree (or equivalent).');
        return;
    }

    // If all checks passed, navigate to the success page.
    // The 'eligibility-success' page itself serves as the "eligible message on the page".
    showPage('eligibility-success');
}

function proceedFromEligibilitySuccess() {
    showPage('basic-details');
}

function navigateFromCVEducation() {
    // Check the global flags set by eligibility check
    if (q4aIsYes || q4bIsYes) {
        showPage('school-referral-details');
    } else {
        showPage('preferred-subjects'); // Or whatever the next page should be if no school referral
    }
}

function toggleSchoolReferralDetails() {
    const schoolReferralDetailsGroup = document.getElementById('schoolReferralDetailsGroup');
    const referralSchoolNameInput = document.getElementById('referralSchoolName');
    const principalNameInput = document.getElementById('principalName');
    const principalEmailInput = document.getElementById('principalEmail');

    if (schoolReferralDetailsGroup) {
        // Show the group if EITHER q4a 'Yes' OR q4b 'Yes' is checked (using global states)
        if (q4aIsYes || q4bIsYes) {
            schoolReferralDetailsGroup.style.display = 'block';
            if (referralSchoolNameInput) referralSchoolNameInput.required = true;
            if (principalNameInput) principalNameInput.required = true;
            if (principalEmailInput) principalEmailInput.required = true;
        } else {
            schoolReferralDetailsGroup.style.display = 'none';
            if (referralSchoolNameInput) {
                referralSchoolNameInput.required = false;
                referralSchoolNameInput.value = '';
            }
            if (principalNameInput) {
                principalNameInput.required = false;
                principalNameInput.value = '';
            }
            if (principalEmailInput) {
                principalEmailInput.required = false;
                principalEmailInput.value = '';
            }
        }
    }
}


function addOtherSubject() {
    const container = document.getElementById('other-subjects-container');
    const subjectRow = document.createElement('div');
    subjectRow.className = 'other-subject-row';

    const select = document.createElement('select');
    select.name = 'other-subjects[]';
    select.className = 'form-control';
    select.innerHTML = `
        <option value="">Select Other Subject</option>
        <option value="whakairo">Whakairo</option>
        <option value="esol">English as a Second Language</option>
        <option value="nz-sign-language">New Zealand Sign Language</option>
        <option value="tokelauan">Tokelauan</option>
        <option value="art">Art</option>
        <option value="pacific-studies">Pacific Studies</option>
        <option value="religious-ed">Religious Education</option>
        <option value="music">Music</option>
        <option value="physical-education">Physical Education</option>
        <option value="health">Health</option>
    `;

    const textarea = document.createElement('textarea');
    textarea.name = 'other-explanations[]';
    textarea.placeholder = 'Explain your relevant study and professional experience';
    textarea.className = 'form-control explanation-textarea';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'btn btn-danger';
    removeButton.type = 'button';
    removeButton.onclick = function() {
        container.removeChild(subjectRow);
    };

    subjectRow.appendChild(select);
    subjectRow.appendChild(textarea);
    subjectRow.appendChild(removeButton);
    container.appendChild(subjectRow);
}

function toggleExplanation(explanationId, isChecked) {
    const explanationTextarea = document.getElementById(explanationId);
    if (explanationTextarea) {
        explanationTextarea.style.display = isChecked ? 'block' : 'none';
        explanationTextarea.required = isChecked;
    }
}

function displaySummary() {
    // --- Eligibility Details ---
    document.getElementById('summary-q2').textContent = document.querySelector('input[name="q2"]:checked') ? document.querySelector('input[name="q2"]:checked').value : 'Not answered';
    const registrationStatusGroup = document.getElementById('q2-group-container');
    const summaryRegistrationRowDisplay = document.getElementById('summary-registration-row-display');
    if (registrationStatusGroup && registrationStatusGroup.style.display !== 'none') {
        summaryRegistrationRowDisplay.style.display = 'block';
        document.getElementById('summary-registration').textContent = document.querySelector('input[name="registration"]:checked') ? document.querySelector('input[name="registration"]:checked').value : 'Not answered';
    } else {
        summaryRegistrationRowDisplay.style.display = 'none';
    }
    document.getElementById('summary-q3').textContent = document.querySelector('input[name="q3"]:checked') ? document.querySelector('input[name="q3"]:checked').nextSibling.textContent.trim() : 'Not answered';
    document.getElementById('summary-q5').textContent = document.querySelector('input[name="q5"]:checked') ? document.querySelector('input[name="q5"]:checked').value : 'Not answered';
    document.getElementById('summary-q4a').textContent = document.querySelector('input[name="q4a"]:checked') ? document.querySelector('input[name="q4a"]:checked').value : 'Not answered';
    document.getElementById('summary-q4b').textContent = document.querySelector('input[name="q4b"]:checked') ? document.querySelector('input[name="q4b"]:checked').value : 'Not answered';


    // --- Personal & Contact Details (from 'basic-details' page) ---
    document.getElementById('summary-fullName').textContent = document.getElementById('name') ? document.getElementById('name').value : 'N/A';
    document.getElementById('summary-preferredName').textContent = document.getElementById('preferredName') ? document.getElementById('preferredName').value : 'N/A';
    document.getElementById('summary-email').textContent = document.getElementById('email') ? document.getElementById('email').value : 'N/A';
    document.getElementById('summary-phone').textContent = document.getElementById('phone') ? document.getElementById('phone').value : 'N/A';
    document.getElementById('summary-dob').textContent = document.getElementById('birthdate') ? document.getElementById('birthdate').value : 'N/A';
    document.getElementById('summary-address').textContent = document.getElementById('address') ? document.getElementById('address').value : 'N/A';
    document.getElementById('summary-gender').textContent = document.getElementById('gender') ? document.getElementById('gender').value : 'N/A';
    document.getElementById('summary-ethnicity').textContent = document.getElementById('ethnicity') ? document.getElementById('ethnicity').value : 'N/A';
    document.getElementById('summary-identity').textContent = document.getElementById('identity') ? document.getElementById('identity').value : 'N/A';
    document.getElementById('summary-iwi').textContent = document.getElementById('iwi') ? document.getElementById('iwi').value : 'N/A';
    const languagesChecked = Array.from(document.querySelectorAll('input[name="languages[]"]:checked'))
                                .map(checkbox => checkbox.nextSibling.textContent.trim());
    document.getElementById('summary-languages').textContent = languagesChecked.length > 0 ? languagesChecked.join(', ') : 'None selected';


    // --- School Referral Details (from 'school-referral-details' page) ---
    const schoolReferralSection = document.getElementById('summary-school-referral-section');
    const q4aYes = document.querySelector('input[name="q4a"][value="yes"]:checked');
    const q4bYes = document.querySelector('input[name="q4b"][value="yes"]:checked');

    if (q4aYes || q4bYes) {
        schoolReferralSection.style.display = 'block';
        document.getElementById('summary-schoolName').textContent = document.getElementById('school-name') ? document.getElementById('school-name').value : 'N/A';
        document.getElementById('summary-principalName').textContent = document.getElementById('principal-name') ? document.getElementById('principal-name').value : 'N/A';
        document.getElementById('summary-principalEmail').textContent = document.getElementById('principal-email') ? document.getElementById('principal-email').value : 'N/A';
    } else {
        schoolReferralSection.style.display = 'none';
    }


    // --- Qualification Details (University/Higher Education from 'cv-education' page) ---
    document.getElementById('summary-universityName').textContent = document.getElementById('university-name') ? document.getElementById('university-name').value : 'N/A';
    document.getElementById('summary-degree').textContent = document.getElementById('degree') ? document.getElementById('degree').value : 'N/A';
    document.getElementById('summary-major').textContent = document.getElementById('major') ? document.getElementById('major').value : 'N/A';
    document.getElementById('summary-qualificationStartYear').textContent = document.getElementById('startYear') ? document.getElementById('startYear').value : 'N/A';
    document.getElementById('summary-qualificationEndYear').textContent = document.getElementById('endYear') ? document.getElementById('endYear').value : 'N/A';

    const studyTypeRadios = document.querySelectorAll('input[name="studyType"]:checked');
    if (studyTypeRadios.length > 0) {
        document.getElementById('summary-studyType').textContent = studyTypeRadios[0].nextSibling.textContent.trim();
    } else {
        document.getElementById('summary-studyType').textContent = 'Not answered';
    }

    const transcriptUpload = document.getElementById('transcript-upload');
    document.getElementById('summary-transcriptUpload').textContent = transcriptUpload && transcriptUpload.files.length > 0 ? transcriptUpload.files[0].name : 'Not uploaded';


    // --- Secondary School Details (from 'cv-education' page) ---
    document.getElementById('summary-secondarySchoolName').textContent = document.getElementById('secondary-school-name') ? document.getElementById('secondary-school-name').value : 'N/A';
    document.getElementById('summary-secondaryHighestQualification').textContent = document.getElementById('highest-qualification') ? document.getElementById('highest-qualification').value : 'N/A';
    document.getElementById('summary-secondaryFinalYear').textContent = document.getElementById('final-year') ? document.getElementById('final-year').value : 'N/A';


    // --- Preferred Teaching Subjects (from 'preferred-subjects' page) ---
    const primarySubjectsSelected = [];
    const subjectsCheckboxes = document.querySelectorAll('input[name="subjects[]"]:checked');
    subjectsCheckboxes.forEach(checkbox => {
        const subjectValue = checkbox.value;
        const subjectLabel = checkbox.nextSibling.textContent.trim();
        let explanation = '';
        const explanationTextarea = document.getElementById(`${subjectValue}-explanation`);
        if (explanationTextarea && explanationTextarea.value) {
            explanation = ` (${explanationTextarea.value})`;
        }
        primarySubjectsSelected.push(`${subjectLabel}${explanation}`);
    });
    document.getElementById('summary-primarySubjects').textContent = primarySubjectsSelected.length > 0 ? primarySubjectsSelected.join('; ') : 'None selected';

    const otherSubjects = document.querySelectorAll('#other-subjects-container select[name="other-subjects[]"]');
    const otherExplanations = document.querySelectorAll('#other-subjects-container textarea[name="other-explanations[]"]');
    let otherSubjectsSummary = [];

    for (let i = 0; i < otherSubjects.length; i++) {
        if (otherSubjects[i].value) {
            let otherExplanation = '';
            if (otherExplanations[i] && otherExplanations[i].value) {
                otherExplanation = ` (${otherExplanations[i].value})`;
            }
            otherSubjectsSummary.push(`${otherSubjects[i].options[otherSubjects[i].selectedIndex].textContent}${otherExplanation}`);
        }
    }
    const otherSubjectsRowDisplay = document.getElementById('summary-otherSubjects-row-display');
    if (otherSubjectsSummary.length > 0) {
        document.getElementById('summary-otherSubjects').textContent = otherSubjectsSummary.join('; ');
        otherSubjectsRowDisplay.style.display = 'block';
    } else {
        otherSubjectsRowDisplay.style.display = 'none';
    }

    const selectedLocations = Array.from(document.querySelectorAll('input[name="location[]"]:checked'))
                             .map(checkbox => checkbox.value);
document.getElementById('summary-locations').textContent = selectedLocations.length > 0 ? selectedLocations.join(', ') : 'None selected';

    // --- Commitment to Kaupapa (from 'commitment-kaupapa' page) ---
    document.getElementById('summary-kaupapaSummary').textContent = document.getElementById('kaupapa-summary') ? document.getElementById('kaupapa-summary').value : 'N/A';
}

function toggleCurrentSchoolNameField() {
    const q4aYes = document.querySelector('input[name="q4a"][value="yes"]');
    const currentSchoolNameGroup = document.getElementById('currentSchoolNameGroup');
    const currentSchoolNameInput = document.getElementById('currentSchoolName');

    if (q4aYes && q4aYes.checked) {
        currentSchoolNameGroup.style.display = 'block';
        currentSchoolNameInput.required = true;
    } else {
        currentSchoolNameGroup.style.display = 'none';
        currentSchoolNameInput.required = false;
        currentSchoolNameInput.value = ''; // Clear value if hidden
    }
}


function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#333';
        document.body.style.color = '#fff';
        document.querySelectorAll('.container').forEach(container => container.style.backgroundColor = '#444');
    } else {
        document.body.style.backgroundColor = '#f4f4f4';
        document.body.style.color = '#000';
        document.querySelectorAll('.container').forEach(container => container.style.backgroundColor = '#fff');
    }
}

// Populate year dropdowns for cv-education page only once
(function() {
    const dropdownStartYear = 1960;
    const dropdownEndYear = 2040;

    const startYearSelect = document.getElementById('startYear');
    const endYearSelect = document.getElementById('endYear');

    if (startYearSelect) {
        for (let i = dropdownStartYear; i <= dropdownEndYear; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            startYearSelect.appendChild(option);
        }
    }

    if (endYearSelect) {
        for (let i = dropdownStartYear; i <= dropdownEndYear; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            endYearSelect.appendChild(option);
        }
    }

    // Populate final-year dropdown on cv-education page
    const finalYearSelect = document.getElementById('final-year');
    if (finalYearSelect) {
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 50; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            finalYearSelect.appendChild(option);
        }
    }
})();

// Initialize explanation textareas to hidden
document.addEventListener('DOMContentLoaded', () => {
    const explanationTextareas = document.querySelectorAll('.explanation-textarea');
    explanationTextareas.forEach(textarea => {
        textarea.style.display = 'none';
        textarea.required = false;
    });

    // Set the initial active step based on the first active page
    const initialActivePage = document.querySelector('.page.active');
    if (initialActivePage) {
        showPage(initialActivePage.id);
    }
});
