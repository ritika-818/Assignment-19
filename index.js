document.addEventListener('DOMContentLoaded', () => {
  const catalogContainer = document.getElementsByClassName('card-container')[0];
  const ramFilterInput = document.getElementsByClassName('inp')[0];
  const btnContainer = document.getElementsByClassName('btn-container')[0];
  const allBtn = document.getElementsByClassName('all-btn')[0];
  const categorySet = new Set();
  let laptops = [];

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
        const ramMatch = element.querySelector('.description')?.textContent.trim().match(/(\d+)\s*GB/i);
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

  function displayLaptops(array) {
    catalogContainer.innerHTML = "";
    if (array.length === 0) {
      catalogContainer.innerHTML = '<p>No laptops available.</p>';
      return;
    }

    array.forEach(laptop => {
      const card = document.createElement("div");
      card.classList.add("card");
      const img = document.createElement("img");
      img.setAttribute("src", laptop.img);
      card.appendChild(img);
      const name = document.createElement("div");
      name.textContent = laptop.title;
      name.style.fontWeight = "bold";
      card.appendChild(name);
      const price = document.createElement("div");
      price.textContent = "$" + laptop.price;
      price.style.color = "red";
      card.appendChild(price);
      const category = document.createElement("div");
      category.textContent = laptop.ram + " GB";
      category.classList.add("category");
      card.appendChild(category);
      catalogContainer.appendChild(card);
      categorySet.add(laptop.ram + " GB");
    });
  }

  function filterLaptopsByRam(array, ramSize) {
    return array.filter(laptop => laptop.ram === ramSize);
  }

  function filterLaptopsByTitle(array, title) {
    return array.filter(laptop => laptop.title.toLowerCase().includes(title.toLowerCase()));
  }

  function addButtons() {
    categorySet.forEach(category => {
      const btn = document.createElement("button");
      btn.textContent = category;
      btn.classList.add("btn");
      btn.addEventListener("click", () => {
        const ramValue = parseInt(category.split(' ')[0], 10);
        const filteredLaptops = filterLaptopsByRam(laptops, ramValue);
        displayLaptops(filteredLaptops);
      });
      btnContainer.appendChild(btn);
    });
  }

  async function initializeCatalog() {
    laptops = await fetchLaptops();
    displayLaptops(laptops);
    addButtons();

    allBtn.addEventListener("click", () => displayLaptops(laptops));

    ramFilterInput.addEventListener("input", (e) => {
      const val = e.target.value;
      const filteredLaptops = filterLaptopsByTitle(laptops, val);
      displayLaptops(filteredLaptops);
    });
  }

  initializeCatalog();
});
