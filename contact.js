/* =========================================================
   PROFYLLES — contact.js
   Phase 8 — Validation du formulaire de contact.
   Responsabilité unique : valider et soumettre #contactForm.
   Ne pas modifier dans les phases suivantes.

   Principes appliqués :
     SRP  — chaque fonction a une seule raison de changer.
     OCP  — les règles de validation sont extensibles sans
            modifier le moteur de validation.
     DRY  — un seul moteur de validation, des règles déclaratives.
   ========================================================= */

// ---------------------------------------------------------
// 1. RÈGLES DE VALIDATION (déclaratives — OCP)
//    Ajouter un champ = ajouter une entrée ici, pas toucher
//    à la logique de validation.
// ---------------------------------------------------------
const VALIDATION_RULES = [
  {
    field:    'firstName',
    errorId:  'firstNameError',
    validate: v => v.trim().length >= 2,
  },
  {
    field:    'lastName',
    errorId:  'lastNameError',
    validate: v => v.trim().length >= 2,
  },
  {
    field:    'email',
    errorId:  'emailError',
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  },
  {
    field:    'phone',
    errorId:  'phoneError',
    validate: v => /^[\d\s\+\-\(\)]{6,}$/.test(v.trim()),
  },
  {
    field:    'role',
    errorId:  'roleError',
    validate: v => v !== '',
  },
  {
    field:    'department',
    errorId:  'departmentError',
    validate: v => v.trim().length >= 2,
  },
  {
    field:    'teamSize',
    errorId:  'teamSizeError',
    validate: v => v !== '',
  },
];

// ---------------------------------------------------------
// 2. MOTEUR DE VALIDATION (SRP — valide un champ unique)
// ---------------------------------------------------------

/**
 * Valide un champ selon sa règle et affiche/masque l'erreur.
 * @param {object} rule  — entrée de VALIDATION_RULES
 * @returns {boolean}    — true si valide
 */
function validateField(rule) {
  const field = document.getElementById(rule.field);
  const error = document.getElementById(rule.errorId);
  if (!field || !error) return true;

  const isValid = rule.validate(field.value);

  field.classList.toggle('error', !isValid);
  error.classList.toggle('visible', !isValid);

  return isValid;
}

/**
 * Valide l'ensemble du formulaire.
 * @returns {boolean} — true si tous les champs sont valides
 */
function validateForm() {
  const results = VALIDATION_RULES.map(validateField);
  return results.every(Boolean);
}

// ---------------------------------------------------------
// 3. RETOUR VISUEL (SRP — gère l'état de l'UI)
// ---------------------------------------------------------

function showSuccess() {
  const formWrap = document.getElementById('contactFormWrap');
  const success  = document.getElementById('contactSuccess');
  if (!formWrap || !success) return;

  formWrap.style.display = 'none';
  success.classList.add('visible');
}

function resetForm() {
  const form = document.getElementById('contactForm');
  if (form) form.reset();

  VALIDATION_RULES.forEach(rule => {
    const field = document.getElementById(rule.field);
    const error = document.getElementById(rule.errorId);
    field?.classList.remove('error');
    error?.classList.remove('visible');
  });
}

// ---------------------------------------------------------
// 4. VALIDATION EN TEMPS RÉEL (blur par champ)
// ---------------------------------------------------------
function attachLiveValidation() {
  VALIDATION_RULES.forEach(rule => {
    const field = document.getElementById(rule.field);
    if (!field) return;
    // Valide au blur (quand l'utilisateur quitte le champ)
    field.addEventListener('blur', () => validateField(rule));
    // Efface l'erreur dès que l'utilisateur retape
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(rule);
    });
  });
}

// ---------------------------------------------------------
// 5. SOUMISSION (SRP — orchestre validation + feedback)
// ---------------------------------------------------------
function handleSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  // Simulation d'envoi (remplacer par fetch API si besoin)
  const btn = e.target.querySelector('[type="submit"]');
  if (btn) {
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;
  }

  setTimeout(() => {
    resetForm();
    showSuccess();
  }, 900);
}

// ---------------------------------------------------------
// 6. INIT — branché sur l'événement natif du formulaire
// ---------------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', handleSubmit);
  attachLiveValidation();
}

// Lance l'init quand le DOM est prêt (compatible avec le
// routing SPA de main.js — re-exécuté si nécessaire).
document.addEventListener('DOMContentLoaded', initContactForm);

// Ré-init quand le routing SPA affiche la page contact
// (la page est cachée/affichée via hidden, pas rechargée)
document.addEventListener('click', e => {
  const link = e.target.closest('[data-page="contact"]');
  if (link) setTimeout(initContactForm, 50);
});
