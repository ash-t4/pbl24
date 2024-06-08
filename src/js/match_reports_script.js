document.addEventListener('DOMContentLoaded', () => {
  fetchMatchReports();
});

async function fetchMatchReports() {
  try {
    console.log("Starting to fetch match reports...");
    const response = await fetch('../match_reports.json');
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const reports = await response.json();
    generateCarousel(reports);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}
function generateCarousel(reports) {
  const carouselInner = document.getElementById('carousel-inner');
  const carouselIndicators = document.getElementById('carousel-indicators');

  if (!carouselInner || !carouselIndicators) {
    console.error("Carousel elements not found!");
    return;
  }

  let index = 0; // Initialize index counter

  for (const report of reports) {
    if (index>=3){
      break;
    }
    // Create carousel item
    const carouselItem = document.createElement('div');
    carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    carouselItem.style.backgroundColor = '#212121';
    carouselItem.dataset.bsInterval = 10000;

    // Create card
    const card = document.createElement('div');
    card.className = 'card h-100 shadow card-span p-3 text-white';
    card.style.borderRadius = '10px';
    card.style.backgroundColor = '#212121';
    card.style.overflow = 'hidden';

    // Card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    cardBody.style.backgroundColor = '#212121';
    cardBody.style.position = 'relative';

    // Truncate summary if it's too long
    const truncatedSummary = truncateSummary(report.summary, 150);

    // Card content
    cardBody.innerHTML = `
      <div class="flex-1" style="background-color: rgb(33, 33, 33); text-align:justify;">
        <h6 class="fs-lg-1 mb-1 text-uppercase text-center">${report.header}</h6>
        <p class="mb-1 text-muted text-center">${report.reporter}</p>
        <p class="mb-0 mt-4 fw-light lh-lg summary">${truncatedSummary}<span class="more-text" style="display:none;">${report.summary.substring(150)}</span></p>
        <div class="text-end">
          <button class="btn btn-link text-white read-more-btn" style="background: none; border: none; cursor: pointer; padding: 0; font-size: 0.9em; color: inherit;">Read More</button>
        </div>
      </div>
    `;

    // Append card body to card
    card.appendChild(cardBody);

    // Append card to carousel item
    carouselItem.appendChild(card);

    // Append carousel item to carousel inner
    carouselInner.appendChild(carouselItem);

    // Create and append indicator
    const indicator = document.createElement('li');
    indicator.className = `mx-2 ${index === 0 ? 'active' : ''}`;
    indicator.dataset.bsTarget = '#carouselTestimonials';
    indicator.dataset.bsSlideTo = index;
    carouselIndicators.appendChild(indicator);

    index++; // Increment index counter
  }

  // Add event listeners for Read More buttons
  document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const summaryElement = e.target.closest('.text-end').previousElementSibling;
      const moreText = summaryElement.querySelector('.more-text');
      if (moreText.style.display === 'none') {
        moreText.style.display = 'inline';
        e.target.textContent = 'Read Less';
      } else {
        moreText.style.display = 'none';
        e.target.textContent = 'Read More';
      }
    });
  });

  console.log("Carousel generated successfully!");
}


function truncateSummary(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength);
}
