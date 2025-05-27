let q4Value = "";

let q4aIsYes = false;
let q4bIsYes = false;

// Define a mapping from page IDs to simplified step category IDs
const pageToStepMap = {
    'welcome': 'step-welcome',
    'eligibility': 'step-eligibility-category',
    'eligibility-success': 'step-eligibility-category', // Maps to the same category
    'basic-details': 'step-personal-details-category',
    'school-referral-details': 'step-education-experience-category', // Maps to the same category
    'cv-education': 'step-education-experience-category',
    'preferred-subjects': 'step-teaching-preferences-category',
    'commitment-kaupapa': 'step-teaching-preferences-category', // Maps to the same category
    'review-application': 'step-review-submit-category',
    'confirmation': 'step-review-submit-category' // Maps to the same category
};

// Add this new function:
function navigateFromCVEducation() {
    // ... validation code ...
    if (q4aIsYes || q4bIsYes) {
        showPage('school-referral-details');
    } else {
        showPage('preferred-subjects'); // Skip referral details if not required
    }
}

function navigateFromBasicDetails() {
    // ... validation code ...
    showPage('cv-education');
}

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

    if (pageId === 'school-referral-details') {
        toggleSchoolReferralDetails();
    }

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
    const registrationGroup = document.getElementById('registration-status-group');
    if (q2Yes && q2Yes.checked) {
        registrationGroup.style.display = 'block';
    } else {
        registrationGroup.style.display = 'none';
    }
}

function checkEligibility() {
    const q2Yes = document.querySelector('input[name="q2"][value="yes"]');
    const registrationYes = document.querySelector('#registration-status-group input[name="registration"][value="yes"]');
    const residencyNone = document.querySelector('input[name="q3"][value="none"]');
    const q5Yes = document.querySelector('input[name="q5"][value="yes"]');

    // Update global state right before checking eligibility and navigating
    q4aIsYes = document.querySelector('input[name="q4a"][value="yes"]:checked') ? true : false;
    q4bIsYes = document.querySelector('input[name="q4b"][value="yes"]:checked') ? true : false;

    const q2 = document.querySelector('input[name="q2"]:checked');
    const q3 = document.querySelector('input[name="q3"]:checked');
    const q5 = document.querySelector('input[name="q5"]:checked');
    const q4a = document.querySelector('input[name="q4a"]:checked');
    const q4b = document.querySelector('input[name="q4b"]:checked');


    if (!q2 || !q3 || !q5 || !q4a || !q4b) {
        alert('Please answer all eligibility questions.');
        return;
    }

    if (q2Yes && q2Yes.checked && (!registrationYes || !registrationYes.checked)) {
        alert('To be eligible, you must be currently registered to teach in NZ if you have completed a teaching qualification.');
        return;
    }
    if (residencyNone && residencyNone.checked) {
        alert('To be eligible, you must be an NZ Citizen or NZ Resident.');
        return;
    }
    if (!q5Yes || !q5Yes.checked) {
        alert('To be eligible, you must have completed a Bachelor’s degree (or equivalent).');
        return;
    }

    // Always navigate to 'eligibility-success' after eligibility check
    showPage('eligibility-success');
}

function toggleCurrentSchoolNameField() {
    const currentSchoolNameGroup = document.getElementById('currentSchoolNameGroup');
    const currentSchoolNameInput = document.getElementById('currentSchoolName');

    // Display if q4a is 'yes' (using the global state)
    if (currentSchoolNameGroup) {
      if (q4aIsYes) {
          currentSchoolNameGroup.style.display = 'block';
          currentSchoolNameInput.required = true;
      } else {
          currentSchoolNameGroup.style.display = 'none';
          currentSchoolNameInput.required = false;
          currentSchoolNameInput.value = '';
      }
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
        <option value="history">History</option>
        <option value="geography">Geography</option>
        <option value="drama">Drama</option>
        <option value="dance">Dance</option>
        <option value="art">Art</option>
        <option value="economics">Economics</option>
        <option value="business">Business Studies</option>
        <option value="music">Music</option>
        <option value="physical-education">Physical Education</option>
        <option value="english-second-language">English as a second language</option>
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
    const registrationStatusGroup = document.getElementById('registration-status-group');
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