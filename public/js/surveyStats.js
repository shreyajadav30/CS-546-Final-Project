const multiselectcharts = document.querySelectorAll(".chartMultiSelect");

const ratingCharts = document.querySelectorAll(".chartRating");
const singleSelectCharts = document.querySelectorAll(".chartSingleSelect");
// console.log(ratingCharts);

ratingCharts.forEach((ratingChart) => {
  const statsDataRating = +JSON.parse(
    ratingChart.getAttribute("data-statsData-rating")
  );
  const ratingScale = +JSON.parse(
    ratingChart.getAttribute("data-rating-scale")
  );

  // console.log(statsDataRating, ratingScale, [
  //   statsDataRating / (100.0 * ratingScale),
  //   100 - statsDataRating / (100.0 * ratingScale),
  // ]);

  const ratingQuestion = ratingChart.getAttribute("data-rating-question-text");

  new Chart(ratingChart, {
    type: "pie",
    data: {
      labels: ["Your Rating", "Rating You Missed"],
      datasets: [
        {
          label: `${ratingQuestion}`,
          data: [
            (statsDataRating * 100) / ratingScale,
            100 - (100 * statsDataRating) / ratingScale,
          ],
          backgroundColor: ["#4caf50", "#d10000"],
        },
      ],
    },
  });
});
multiselectcharts.forEach((multiSelectChart) => {
  const statsDatamulti = JSON.parse(
    multiSelectChart.getAttribute("data-statsData-multi-select")
  );

  const multiQuestion = multiSelectChart.getAttribute(
    "data-multi-question-text"
  );

  new Chart(multiSelectChart, {
    type: "bar",
    data: {
      labels: Object.keys(statsDatamulti.totalCounts),
      datasets: [
        {
          label: "Number of Selections",
          data: Object.values(statsDatamulti.totalCounts),
          borderWidth: 1,
        },
      ],
    },
  });
});

singleSelectCharts.forEach((singleSelectChart) => {
  const statsDataSingle = JSON.parse(
    singleSelectChart.getAttribute("data-statsData-single-select")
  );

  const singleQuestion = singleSelectChart.getAttribute(
    "data-single-question-text"
  );

  new Chart(singleSelectChart, {
    type: "bar",
    data: {
      labels: Object.keys(statsDataSingle),
      datasets: [
        {
          label: "Number of Selections",
          data: Object.values(statsDataSingle),
          borderWidth: 1,
        },
      ],
    },
  });
});
