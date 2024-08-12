document.addEventListener('DOMContentLoaded', () => {
  const catalogContainer = document.getElementById('catalog');
  const ramFilterInput = document.getElementById('ram-filter');

  async function fetchLaptops() {
    try {
      const response = await fetch('https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const laptopElements = doc.querySelectorAll('.thumbnail');

      return Array.from(laptopElements).map(element => {
        const title = element.querySelector('.title')?.textContent.trim();
        const ramMatch = element.querySelector('.description')?.textContent.trim().match(/(\d+)\s*GB/);
        const ram = ramMatch ? parseInt(ramMatch[1], 10) : null;
        const price = element.querySelector('.price')?.textContent.trim();
        const img = 'https://webscraper.io/images/test-sites/e-commerce/items/cart2.png';

        return {
          title: title || 'Unknown',
          ram: ram,
          price: price || 'Unknown',
          img: img || '',
        };
      }).filter(laptop => laptop.ram !== null);
    } catch (error) {
      console.error('Error fetching page source:', error);
      return [];
    }
  }

  function displayLaptops(laptops) {
    if (laptops.length === 0) {
      catalogContainer.innerHTML = '<p>No laptops available.</p>';
      return;
    }
    laptops.map((item)=>{
      console.log(item.ram)
    })
    
    catalogContainer.innerHTML = laptops.map(laptop => `
      <div class="catalog-item"> 
        <img src="${laptop.img}" />
        <h2>${laptop.title}</h2>
        <p class="ram">${laptop.ram} GB RAM</p>
        <p class="price">${laptop.price}</p>
      </div>
    `);
  }

  function filterLaptopsByRam(laptops, ramSize) {
    return laptops.filter(laptop => laptop.ram === ramSize);
  }

  async function initializeCatalog() {
    const laptops = await fetchLaptops();
    displayLaptops(laptops);

    ramFilterInput.addEventListener('input', () => {
      const ramSize = parseInt(ramFilterInput.value, 10);
      const filteredLaptops = filterLaptopsByRam(laptops, ramSize);
      displayLaptops(filteredLaptops);
    });
  }

  initializeCatalog();
});
