const multiselectcharts = document.querySelectorAll(".chartMultiSelect");
const keywordCharts = document.querySelectorAll(".chartKeywords");
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

keywordCharts.forEach((keywordChart) => {
  const keywordData = JSON.parse(
    keywordChart.getAttribute("data-keywords") || "{}"
  );
  const questionText = keywordChart.getAttribute("data-question-text");

  const labels = Object.keys(keywordData);
  const dataCounts = Object.values(keywordData);

  if (labels.length > 0) {
    new Chart(keywordChart, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: `Keyword Frequency: ${questionText}`,
            data: dataCounts,
            borderWidth: 1,
            backgroundColor: "#4caf50",
            borderColor: "#2e7d32",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} times`,
            },
          },
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Count" } },
          x: { title: { display: true, text: "Keywords" } },
        },
      },
    });
  }
});
