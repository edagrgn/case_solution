$(document).ready(function () {
 
  let products = [];
  let likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
  let currentPosition = 0;

  
  function getProducts() {
    const url =
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";

    //I first checked localStorage to see if the product data was already available
    if (localStorage.getItem("products")) 
    {
      products = JSON.parse(localStorage.getItem("products"));
      showProducts();   // Display the products on the page
      showFavorites();  // Display the favorite products
    } 
    else 
    {
      //if not available in localStorage, fetch the data from the API
      $.getJSON(url, function (data) 
      {
        products = data;  // Store fetched data in the products variable
        localStorage.setItem("products", JSON.stringify(products));
        showProducts();
        showFavorites();
      });
    }
  }

  
  function showProducts() {
    let productHTML = "";
  //I iterated over the product array to generate HTML for each product

    products.forEach(function (item)
     {
      //check if the product is liked by the user
      //if so, apply the "blue" class
      const isLiked = likedProducts.includes(item.id) ? "blue" : "";  
      

      //add the product's HTML to the productHTML variable
      productHTML += `
                <div class="carousel-item" data-id="${item.id}">
                    <img src="${item.img}" alt="${item.name}" class="product-img" />

                    <div class="heart-icon">
                        <i class="fa fa-heart ${isLiked}" data-id="${item.id}"></i>
                    </div>

                    <div class="product-card-information"> 
                        <p class="product-title">${item.name}</p>
                        <p class="price">${item.price} TL</p>
                    </div>

                </div>
            `;
    });

    $(".carousel-items").html(productHTML);
  }

  
  function showFavorites() {
    let favHTML = "";

    //iterate over the 'likedProducts'2 array to find the corresponding products
    likedProducts.forEach(function (id) 
    //I searched for the product that matches the ID of the liked product in the products array
    {
      const item = products.find((p) => p.id === id);
      if (item) {
        //generate HTML for the favorite product and append it to favHTML
        favHTML += `
                    <div class="favorites-item">
                        <img src="${item.img}" alt="${item.name}" />
                        <div class="product-card-information"> 
                            <p class="product-title">${item.name}</p>
                            <p class="price">${item.price} TL</p>
                        </div>
                    </div>
                `;
      }
    });

    //I added the generated favHTML to the DOM inside the element with the class "favorites-container"
    $(".favorites-container").html(favHTML);
  }

  
  function moveCarousel(direction) {
    //get the width of a single carousel item
    const itemWidth = $(".carousel-item").outerWidth(true);
     //calculate how many items are visible in the carousel container
    const visibleItems = Math.floor(
      $(".carousel-container").width() / itemWidth
    );
    const maxPosition = products.length - visibleItems;

    //if the direction is right and not at the maximum position, move one step to the right
    if (direction === "right" && currentPosition < maxPosition) 
    {
      currentPosition++;
    } 
      //if the direction is left and not at the minimum position, move one step to the left
    else if (direction === "left" && currentPosition > 0) 
    {
      currentPosition--;
    }

    $(".carousel-items").css(
      "transform",
      `translateX(-${currentPosition * itemWidth}px)`
    );
  }


  //handles the click event on a product in the carousel
  function productClick(e) {
    const productId = $(e.currentTarget).closest(".carousel-item").data("id");
    const product = products.find((p) => p.id === productId);
    
    if (product && product.url) //if the product exists and has a valid URL, open the URL in a new browser tab
     {
      window.open(product.url, "_blank");
    }
  }

  
  function favoriteClick(e) {
    const heartIcon = $(e.currentTarget);
    const productId = heartIcon.data("id");

    if (heartIcon.hasClass("blue")) 
      {
      heartIcon.removeClass("blue"); //remove it from favorites
      likedProducts = likedProducts.filter((id) => id !== productId);
    } 
    else {
      //if the product is not a favorite, add it to favorites
      heartIcon.addClass("blue");
      likedProducts.push(productId);
    }

    //updted the likedProducts in localStorage
    localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
    showFavorites();
  }



  $("head").append(`
    <style>
  
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #faf9f7;
}

.product-detail {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 0 20px;
}
.title {
  justify-content: flex-start;
  font-size: 24px;
  margin-bottom: 20px;
  font-size: 24px;
  color: #29323b;
  line-height: 33px;
  font-weight: lighter;
  padding: 15px 0;
  margin: 0;
  display: flex;
  padding-left: 4%;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-container {
  display: flex;
  overflow: hidden;
  width: 100%;
}

.carousel-items {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-item {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  width: calc(100% / 7);
  margin: 0 10px;
  text-align: center;
  position: relative;
}

.carousel-item img {
  width: 100%;
  height: auto;
  cursor: pointer;
}

.carousel-prev,
.carousel-next {
  background-color: initial;
  border: initial;
  font-size: initial;
  color: initial;
  cursor: pointer;
}

.fa-angle-left:before,
.fa-angle-right:before {
  font-size: 35px;
}

.favorites-section {
  margin-top: 50px;
  padding: 0 20px;
}

.favorites-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.favorites-item {
  display: flex;
  flex-direction: column;
  width: 160px;
  text-align: center;
  position: relative;
}

.favorites-item img {
  width: 100%;
  height: auto;
}

.heart-icon {
  cursor: pointer;
  position: absolute;
  top: 9px;
  right: 5px;
  width: 24px;
  height: 24px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  border: solid 0.5px #b6b7b9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fa-heart {
  position: absolute;
  top: 5px;
  right: 4px;
  font-size: 17px;
  color: gray;
  cursor: pointer;
  transition: color 0.3s ease;
}

.product-card-information {
  background-color: white;
  padding: 0 10px;
}

.price {
  color: #193db0;
  font-weight: 600;
  text-align: start;
  font-size: 18px;
  font-family: sans-serif;
}

.product-title {
  min-height: 80px;
  text-align: start;
  font-size: 14px;
  font-weight: lighter;
  font-family: sans-serif;
}

.fa-heart.blue {
  color: blue;
}

@media screen and (max-width: 768px) {
  .carousel-item {
    width: calc(100% / 4);
  }
}

@media screen and (max-width: 480px) {
  .carousel-item {
    width: calc(100% / 3.5);
  }
}

        </style>
    `);


  $(".carousel-prev").click(() => moveCarousel("left"));
  $(".carousel-next").click(() => moveCarousel("right"));
  $(document).on("click", ".product-img", productClick);
  $(document).on("click", ".fa-heart", favoriteClick);

  
  getProducts();
});
