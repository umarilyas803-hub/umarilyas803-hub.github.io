'use strict';
// GitHub Pages has no application server. Never claim an email was sent.
function prepareEmail(formId, statusId, subject, compose) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const status = document.getElementById(statusId);
    const link = document.createElement('a');
    link.href = `mailto:umariyas803@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose(data))}`;
    link.textContent = 'Open your email app to review and send →';
    status.replaceChildren('Your email is ready. Nothing has been sent. ', link);
    status.hidden = false;
  });
}
prepareEmail('review-form', 'review-status', 'Portfolio client review', data =>
  `Name: ${data.get('name')}\nReply email: ${data.get('email')}\nProject: ${data.get('project')}\nRating: ${data.get('rating')} / 5\n\nReview:\n${data.get('review')}\n\nI consent to publication of my name, project, rating and review after approval. Please keep my email private.`);
prepareEmail('enquiry-form', 'enquiry-status', 'Portfolio project enquiry', data =>
  `Name: ${data.get('name')}\nReply email: ${data.get('email')}\nService: ${data.get('service')}\n\nProject goals:\n${data.get('goals')}`);

const reviewContainer = document.getElementById('published-reviews');
if (reviewContainer) {
  fetch('reviews.json').then(response => {
    if (!response.ok) throw new Error('Reviews unavailable');
    return response.json();
  }).then(reviews => {
    const approved = reviews.filter(review => review.approved === true && review.consent === true &&
      typeof review.name === 'string' && typeof review.review === 'string' &&
      Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5);
    if (!approved.length) return;
    reviewContainer.replaceChildren();
    approved.forEach(review => {
      const article = document.createElement('article');
      article.className = 'review-item';
      const stars = document.createElement('p');
      stars.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)} · ${review.rating} / 5`;
      const quote = document.createElement('blockquote');
      quote.textContent = review.review;
      const name = document.createElement('b');
      name.textContent = review.name;
      const project = document.createElement('p');
      project.textContent = review.project || 'Project collaboration';
      article.append(stars, quote, name, project);
      reviewContainer.append(article);
    });
  }).catch(() => {
    reviewContainer.textContent = 'Reviews could not be loaded. Please try again later.';
  });
}
