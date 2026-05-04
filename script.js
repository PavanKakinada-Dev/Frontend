(function () {
 'use strict';

 // Tab definitions used by the side rails
 const TABS = {
 team: { label: 'Our Team', className: 'side-tab--white' },
 personal: { label: 'Personal Details', className: 'side-tab--pink' },
 contact: { label: 'Contact Us', className: 'side-tab--orange' }
 };

 const PAGE_ORDER = ['team', 'personal', 'contact'];

 const pages = {
 team: document.getElementById('page-team'),
 personal: document.getElementById('page-personal'),
 contact: document.getElementById('page-contact')
 };

 const navLinks = document.querySelectorAll('.nav-link');
 const leftRail = document.getElementById('leftTabs');
 const rightRail = document.getElementById('rightTabs');
 const logo = document.querySelector('.logo');

 function buildTab(key) {
 const tab = TABS[key];
 const btn = document.createElement('button');
 btn.type = 'button';
 btn.className = 'side-tab ' + tab.className;
 btn.dataset.page = key;
 btn.innerHTML = '<span>' + tab.label + '</span>';
 btn.addEventListener('click', () => showPage(key));
 return btn;
 }

 function renderRails(activeKey) {
 leftRail.innerHTML = '';
 rightRail.innerHTML = '';

 const idx = PAGE_ORDER.indexOf(activeKey);

 PAGE_ORDER.slice(0, idx).forEach((key) => {
 leftRail.appendChild(buildTab(key));
 });

 PAGE_ORDER.slice(idx + 1).forEach((key) => {
 rightRail.appendChild(buildTab(key));
 });
 }

 function showPage(key) {
 if (!pages[key]) return;

 const currentKey = PAGE_ORDER.find((k) => pages[k].classList.contains('active'));
 if (currentKey === key) return;

 const fromIdx = PAGE_ORDER.indexOf(currentKey);
 const toIdx = PAGE_ORDER.indexOf(key);
 const direction = toIdx > fromIdx ? 'from-right' : 'from-left';

 Object.keys(pages).forEach((k) => {
 pages[k].classList.toggle('active', k === key);
 pages[k].classList.remove('page--anim-from-right', 'page--anim-from-left');
 });

 const incoming = pages[key];
 const animClass = 'page--anim-' + direction;
 incoming.classList.add(animClass);

 incoming.addEventListener('animationend', function handler() {
 incoming.classList.remove(animClass);
 incoming.removeEventListener('animationend', handler);
 });

 navLinks.forEach((link) => {
 link.classList.toggle('active', link.dataset.page === key);
 });

 renderRails(key);
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }

 navLinks.forEach((link) => {
 link.addEventListener('click', (e) => {
 e.preventDefault();
 showPage(link.dataset.page);
 });
 });

 if (logo) {
 logo.addEventListener('click', (e) => {
 e.preventDefault();
 showPage('team');
 });
 }

 // ===== FORM LOGIC =====
 const form = document.getElementById('personalForm');
 if (form) {
 const mobileInput = form.querySelector('#mobileInput');
 const mobileError = form.querySelector('#mobileError');
 const countryCode = form.querySelector('select[name="countryCode"]');
 const editBtn = form.querySelector('#editBtn');
 const saveBtn = form.querySelector('#saveBtn');
 const editableFields = form.querySelectorAll('input, textarea, select');

 
 const nameInput = form.querySelector('input[name="name"]');
 const addressInput = form.querySelector('textarea[name="address"]');
 const nameError = form.querySelector('#nameError');
 const addressError = form.querySelector('#addressError');

 function setLocked(locked) {
 editableFields.forEach((el) => {
 el.disabled = locked;
 });
 form.classList.toggle('is-locked', locked);
 editBtn.disabled = !locked;
 saveBtn.disabled = locked;
 }

 mobileInput.addEventListener('keypress', (e) => {
 if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
 e.preventDefault();
 showMobileError('Only digits (0-9) are allowed.');
 }
 });
 
nameInput.addEventListener('input', () => {
 if (nameInput.value.trim() !== '') {
  nameError.textContent = '';
  nameError.classList.remove('visible');
 }
});

addressInput.addEventListener('input', () => {
 if (addressInput.value.trim() !== '') {
  addressError.textContent = '';
  addressError.classList.remove('visible');
 }
});

 mobileInput.addEventListener('input', () => {
 const cleaned = mobileInput.value.replace(/\D/g, '');
 if (cleaned !== mobileInput.value) {
 mobileInput.value = cleaned;
 showMobileError('Only digits (0-9) are allowed.');
 } else {
 clearMobileError();
 }
 });

 mobileInput.addEventListener('paste', (e) => {
 const text = (e.clipboardData || window.clipboardData).getData('text');
 if (/\D/.test(text)) {
 e.preventDefault();
 const digits = text.replace(/\D/g, '');
 document.execCommand && document.execCommand('insertText', false, digits);
 showMobileError('Pasted value contained invalid characters — only digits kept.');
 }
 });

 function showMobileError(msg) {
 mobileError.textContent = msg;
 mobileError.classList.add('visible');
 mobileInput.classList.add('has-error');
 }

 function clearMobileError() {
 mobileError.textContent = '';
 mobileError.classList.remove('visible');
 mobileInput.classList.remove('has-error');
 }

 function validateMobile() {
 const val = mobileInput.value.trim();
 if (!val) {
 showMobileError('Mobile number is required.');
 return false;
 }
 if (!/^[0-9]+$/.test(val)) {
 showMobileError('Mobile number can contain digits only.');
 return false;
 }
 if (val.length < 6 || val.length > 15) {
 showMobileError('Mobile number must be between 6 and 15 digits.');
 return false;
 }
 clearMobileError();
 return true;
 }

 
 function validateName() {
 const val = nameInput.value.trim();
 if (!val) {
  nameError.textContent = 'Name is required.';
  nameError.classList.add('visible');
  return false;
 }
 nameError.textContent = '';
 nameError.classList.remove('visible');
 return true;
 }

 function validateAddress() {
 const val = addressInput.value.trim();
 if (!val) {
  addressError.textContent = 'Address is required.';
  addressError.classList.add('visible');
  return false;
 }
 addressError.textContent = '';
 addressError.classList.remove('visible');
 return true;
 }

 editBtn.addEventListener('click', () => {
 setLocked(false);
 mobileInput.focus();
 });

 form.addEventListener('submit', (e) => {
 e.preventDefault();
 if (form.classList.contains('is-locked')) return;

 // VALIDATION FLOW
 let isValid = true;

 if (!validateName()) {
  nameInput.focus();
  isValid = false;
 }

 if (!validateMobile()) {
  mobileInput.focus();
  isValid = false;
 }

 if (!validateAddress()) {
  addressInput.focus();
  isValid = false;
 }

 if (!isValid) return;

 const data = Object.fromEntries(new FormData(form).entries());
 data.fullMobile = (countryCode ? countryCode.value : '') + ' ' + data.mobile;
 console.log('Personal details submitted:', data);
 setLocked(true);
 });

 setLocked(true);
 }

 renderRails('team');
 navLinks.forEach((link) => {
 link.classList.toggle('active', link.dataset.page === 'team');
 });

})();