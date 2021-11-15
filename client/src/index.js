/*********
 * Utils *
 *********/

const isNil =
  (x) => {

    return typeof x === `undefined` || x === null;
  }

const request =
  async (
    method,
    url,
    body,
  ) => {

    const preparedBody =
      isNil(body)
        ? undefined
        : JSON.stringify(body);

    const request = new Request(
      `/api/${url}`,
      {
        method: method,
        headers: {
          'Content-Type': `application/json`
        },
        mode: `cors`,
        body: preparedBody,
      },
    );

    const response = await fetch(request);

    return await response.json();
  }

/********************
 * API Access Layer *
 ********************/

const readProduct =
  async (productId) => {
    try {

      return await request(
        `GET`,
        `products/${productId}`,
      );
    } catch (error) {

      alert(`Error: Cannot read product.`);
    }
  }

/**********************
 * Presentation Layer *
 **********************/

const createReviewStars =
  (score) => {

    const reviewStarsElement = document.createElement(`span`);

    const filledStarsElements = Array(5)
      .fill()
      .map(
        (_, i) => {

          const starElement = document.createElement(`span`);
          const startTextNode = document.createTextNode(`★`);

          starElement.classList.add(`star`);

          if (i < score) {

            starElement.classList.add(`star--active`);
          }

          starElement.replaceChildren(startTextNode);

          return starElement;
        }
      );

    reviewStarsElement.replaceChildren(...filledStarsElements)

    return reviewStarsElement;
  }

const createReviewScore =
  (score) => {

    const reviewScoreElement = document.createElement(`span`);

    reviewScoreElement.classList.add(`review__score`);

    const textElement = document.createTextNode(score);

    reviewScoreElement.replaceChildren(textElement);

    return reviewScoreElement;
  }

const createReviewDescription =
  (description) => {

    const reviewDescriptionElement = document.createElement(`span`);

    reviewDescriptionElement.classList.add(`review__description`);

    const textElement = document.createTextNode(description);

    reviewDescriptionElement.replaceChildren(textElement)

    return reviewDescriptionElement;
  }

const createReviewElement =
  (review) => {

    const starsElement = createReviewStars(review.score);
    const scoreElement = createReviewScore(review.score);
    const descriptionElement = createReviewDescription(review.description);

    const reviewElement = document.createElement(`li`);

    reviewElement.classList.add(`review`);

    reviewElement.replaceChildren(
      starsElement,
      scoreElement,
      descriptionElement,
    );

    return reviewElement;
  }

const createProductTitleElement =
  (title) => {

    const productTitleElement = document.createElement(`h1`);

    productTitleElement.classList.add(`product__title`);

    const textElement = document.createTextNode(title);

    productTitleElement.replaceChildren(
      textElement,
    );

    return productTitleElement;
  }

const createAverageReviewElement =
  (averageScore) => {

    const averageScoreRounded = Math.round(averageScore);
    const averageScoreFixed = averageScore.toFixed(1);

    const averageScoreElement = createReviewScore(averageScoreFixed);

    averageScoreElement.classList.add(`product__average-review__score`);

    const averageStarsElement = createReviewStars(averageScoreRounded);

    const averageReviewElement = document.createElement(`div`);

    averageReviewElement.classList.add(`product__average-review`);

    averageReviewElement.replaceChildren(
      averageScoreElement,
      averageStarsElement,
    );

    return averageReviewElement
  }

const createProductElement =
  (product) => {

    const productTitleElement = createProductTitleElement(product.name);
    const averageReviewElement = createAverageReviewElement(product.avgScore);

    const productElement = document.createElement(`div`);

    productElement.classList.add(`product`);

    productElement.replaceChildren(
      productTitleElement,
      averageReviewElement,
    );

    return productElement;
  }

const renderProduct =
  (product) => {

    const productElement = createProductElement(product);

    const productOutlet = document.getElementById(`product-outlet`);

    productOutlet.replaceChildren(
      productElement,
    );
  }

const createReviewsElement =
  (reviews) => {

    const reviewElements = reviews.map(createReviewElement);

    const reviewsElement = document.createElement(`ul`);

    reviewsElement.classList.add(`reviews`)

    reviewsElement.replaceChildren(...reviewElements);

    return reviewsElement;
  }

const renderReviews =
  (reviews) => {

    const reviewsElement = createReviewsElement(reviews);

    const reviewsOutlet = document.getElementById(`reviews-outlet`);

    reviewsOutlet.replaceChildren(reviewsElement);
  }

const renderPage =
  (product) => {

    renderProduct(product);
    renderReviews(product.reviews);
  }

const getProductId =
  () => {

    return new URL(location.href).searchParams.get('productId');
  }

/********
 * Init *
 ********/

(
  async () => {

    const productId = getProductId();
    const product = await readProduct(productId);

    renderPage(product);
  }
)();
