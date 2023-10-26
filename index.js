const countriesContainer = document.querySelector(".countries");
const btn = document.querySelector(".btn-country");
const clefApi = "160098994608019167585x18970";

const renderCountry = (data, className = "") => {
  const currencies = Object.values(data.currencies);
  const languages = Object.values(data.languages);

  const html = `
    <article class='country ${className}'>
      <img class='country__img' src='${data.flags.png}' />
      <div class='country__data'>
        <h3 class='country__name'>${data.name.common}</h3>
        <h4 class='country__region'>${data.region}</h4>
        <p class="country__row"><span>💰</span>${currencies[0].name}</p>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(2)} M. people</p>
        <p class="country__row"><span>🗣️</span>${languages[0]}</p>
      </div>
    </article>
      `;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

const renderError = (msg) => {
  countriesContainer.insertAdjacentHTML("beforeend", msg);
  countriesContainer.style.opacity = 1;
};

const getJSON = async (url, errorMsg = "Something went wrong") => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${errorMsg}`);
  }
  return await res.json();
};

const getPosition = new Promise((resolve, reject) => {
  // navigator.geolocation.getCurrentPosition(
  //   (position) => resolve(position),
  //   (err) => reject(err)
  // );
  navigator.geolocation.getCurrentPosition(resolve, reject);
});

// // Promise.resolve('abc').then((res) => console.log(res));
// // Promise.reject(new Error('Problem!')).catch((err) => console.error(err));

const whereAmI = async () => {
  try {
    const pos = await getPosition;
    const { latitude: lat, longitude: lng } = pos.coords;
    const res = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${clefApi}`
    );

    if (!res.ok) {
      throw new Error("Problem with Geocoding");
    }

    const dataGeoloc = await res.json();

    const res2 = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeoloc.country}`
    );

    if (!res2.ok) {
      throw new Error("Country not found");
    }
    const dataCountry = await res2.json();

    renderCountry(...dataCountry);

    return `you are in ${dataGeoloc.city}, ${dataGeoloc.country}`;
  } catch (error) {
    console.error(error);
    renderError(error.message);

    throw error;
  }
};

btn.addEventListener("click", whereAmI);

// console.log("1 : will location");
// async () => {
//   try {
//     const city = await whereAmI();
//     console.log(`2a: ${city}`);
//   } catch (error) {
//     console.error(`2b: ${err.message}`);
//   }
//   console.log("3 :  finished");
// };

// const getCountries = async (c1,c2,c3) => {
// try {
//   // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
//   // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
//   // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

// const data = await Promise.all([
//   getJSON(`https://restcountries.com/v3.1/name/${c1}`),
//   getJSON(`https://restcountries.com/v3.1/name/${c2}`),
//   getJSON(`https://restcountries.com/v3.1/name/${c3}`),
// ])

//   return data.map((el) => console.log(el[0].capital))
// } catch (error) {
//   console.error(error)
// }
// }

// getCountries('france','portugal','italy')
