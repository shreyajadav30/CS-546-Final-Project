const start = document.getElementById("startDate");
const end = document.getElementById("endDate");

const surveyForm = document.getElementById("survey-form");
const addSurveyForBtn = document.getElementById("addSurveyFor");

const userDropDown = document.getElementById("userDropDown");
const selectedSurveyForUser = document.getElementById("selectedSurveyForUser");

const dropdown_container = document.getElementById("dropdown-container");

const userMappingDataInput = document.getElementById("userMappingData");
const selectedQuestionsInput = document.getElementById("selectedQuestions");

let isSurveyForClicked = false;
let isSurveyByClicked = false;

const GET_ALL_USERS_URL = "http://localhost:3000/users/getAllUsers";
const GET_ALL_QUESTION_URL = "http://localhost:3000/survey/getAllQuestion";

start.addEventListener("change", () => {
  const selectedStartDate = this.value;
  end.min = selectedStartDate;
  const today = new Date();
  console.log(today);
  if (end.value && end.value < selectedStartDate) {
    end.value = "";
  }
  //   if(selectedStartDate > today){
  //     const inactiveOption = dropdown.querySelector('option[value="Active"]');
  //     inactiveOption.disabled = true;
  //   }
});

// const selectAll = document.getElementById("selectAll");
const userCheck = document.querySelectorAll(".userMapping");

// selectAll.addEventListener("change",  () => {
//   const isChecked = this.checked;

//   userCheck.forEach((checkbox) => {
//     checkbox.checked = isChecked;
//   });
// });

const createUserDropdown = () => {
  return userDropDown.cloneNode(true);
};

const renderUsers = (items) => {
  return items
    .map(
      (item) => `
              <li class="dropdown-item" data-id="${item._id}">${item.firstName} ${item.lastName}</li>
          `
    )
    .join("");
};

const populateDropdownWithUserData = (dropdown, items, onSelect) => {
  const list = dropdown.querySelector(".dropdown-list");
  const searchInput = dropdown.querySelector(".search-input");

  dropdown.style.display = "block";
  list.innerHTML = renderUsers(items);

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm)
    );
    list.innerHTML = renderUsers(filteredItems);
  });

  list.addEventListener("click", (e) => {
    if (e.target.classList.contains("dropdown-item")) {
      const selectedId = e.target.dataset.id;
      const selectedItem = items.find((item) => item._id == selectedId);
      onSelect(selectedItem);
    }
  });

  document.addEventListener(
    "click",
    (handler = (e) => {
      if (!dropdown.contains(e.target) && e.target !== addSurveyForBtn) {
        dropdown.style.display = "none";
        document.removeEventListener("click", handler);
        isSurveyForClicked = false;
      }
    })
  );
};

let userMappingData = {};

const addSubUserToList = (_id, accordionItem, selectedUser) => {
  const surveyByList = accordionItem.querySelector(".surveyby-list");
  const surveyByEle = document.createElement("div");
  surveyByEle.className = "surveyByUser-item";
  surveyByEle.innerHTML = `
            <span>${selectedUser.firstName} ${selectedUser.lastName}</span>
            <button type="button" class="remove-btn">Remove</button>
        `;

  userMappingData[_id].push(selectedUser._id);

  surveyByEle.querySelector(".remove-btn").addEventListener("click", () => {
    surveyByList.removeChild(surveyByEle);
    userMappingData[_id] = userMappingData[_id].filter(
      (id) => id !== selectedUser._id
    );
  });

  surveyByList.appendChild(surveyByEle);
};

const removeSurveyFor = (id) => {
  const elements = document.querySelectorAll(".accordion-item");

  elements.forEach((element) => {
    if (element.id === `${id}`) {
      element.remove();
    }
  });

  delete userMappingData[id];
};

const addUserToList = async (user) => {
  const accordionItem = document.createElement("div");
  accordionItem.className = "accordion-item";
  accordionItem.id = user._id;
  accordionItem.innerHTML = `
            <button type="button" class="remove-btn" onclick="removeSurveyFor('${user._id}')">Remove</button>
            <div class="accordion-header">
                <span>${user.firstName} ${user.lastName}</span>
                <div>
                  <button type="button" class="add-surveyby">+ Add Survey By</button>
                  <button type="button" class="add-surveyby">Open</button>
                </div>
            </div>
            <div class="accordion-content">
                <div class="surveyby-list"></div>
            </div>
        `;

  userMappingData[user._id] = [];

  const addSurveyByBtn = accordionItem.querySelector(".add-surveyby");
  addSurveyByBtn.addEventListener("click", async (e) => {
    const dropdown = createUserDropdown();
    dropdown_container.appendChild(dropdown);

    let usersData = await getAllUser();
    let filteredData = usersData.filter((x) => x._id !== user._id);
    filteredData = filteredData.filter(
      (x) => !userMappingData[user._id].includes(x._id)
    );

    populateDropdownWithUserData(dropdown, filteredData, (selectedUser) => {
      dropdown_container.removeChild(dropdown);
      addSubUserToList(user._id, accordionItem, selectedUser);
      console.log(selectedUser);
    });
  });

  accordionItem
    .querySelector(".accordion-header")
    .addEventListener("click", (e) => {
      if (e.target !== addSurveyByBtn) {
        const content = accordionItem.querySelector(".accordion-content");
        content.classList.toggle("active");
      }
    });

  selectedSurveyForUser.appendChild(accordionItem);
};

const getAllUser = async () => {
  try {
    let data = await getData(GET_ALL_USERS_URL);
    return data;
  } catch (error) {
    console.log("====================================");
    console.log("Some error occured while fetching user data.");
    console.log("====================================");
  }
};

addSurveyForBtn.addEventListener("click", async (e) => {
  if (!isSurveyForClicked) {
    const dropdown = createUserDropdown();

    // dropdown_container.appendChild(dropdown);
    addSurveyForBtn.after(dropdown);

    let usersData = await getAllUser();
    usersData = usersData.filter(
      (x) => !Object.keys(userMappingData).includes(x._id)
    );

    populateDropdownWithUserData(dropdown, usersData, (selectedUser) => {
      dropdown_container.removeChild(dropdown);
      addUserToList(selectedUser);
      // console.log(selectedUser);
      isSurveyForClicked = !isSurveyForClicked;
    });
    isSurveyForClicked = !isSurveyForClicked;
  }
});

const getAllQuestionData = async () => {
  try {
    let data = await getData(GET_ALL_QUESTION_URL);
    return data;
  } catch (error) {
    console.log("====================================");
    console.log("Some error occured while fetching user data.");
    console.log("====================================");
  }
};

let selectedQuestion = {};
let counter = 0;

let addQuestionBtn = document.getElementById("questionnaire");
let selectedQuestionDevTag = document.getElementById("selectedQuestionDevTag");

addQuestionBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const id = `questionCategory-${counter++}`;
  let QuestionsData = await getAllQuestionData();
  let letQueCategories = [];
  QuestionsData.map((que) => {
    if (!letQueCategories.includes(que.categoryName)) {
      let isAlreadyAdded = false;
      Object.keys(selectedQuestion).map((idx) => {
        if (selectedQuestion[idx].category === que.categoryName) {
          isAlreadyAdded = true;
        }
      });
      if (!isAlreadyAdded) {
        letQueCategories.push(que.categoryName);
      }
    }
  });

  const container = document.createElement("div");
  container.className = "selection-container";
  container.id = id;

  const closeBtn = document.createElement("button");
  closeBtn.className = "remove-btn";
  closeBtn.innerHTML = "Remove";
  closeBtn.onclick = () => {
    container.remove();
    delete selectedQuestion[id];
  };

  const questionCategories = document.createElement("select");
  questionCategories.innerHTML =
    '<option value="">Select Question Category...</option>';
  letQueCategories.forEach((cat) => {
    questionCategories.innerHTML += `<option value="${cat}">${cat}</option>`;
  });

  const questions = document.createElement("select");
  questions.multiple = true;
  questions.hidden = true;

  const selectedQuestionsDiv = document.createElement("div");
  selectedQuestionsDiv.hidden = true;
  selectedQuestionsDiv.className = "selected-questions";

  questionCategories.addEventListener("change", () => {
    const categoryOfQquestion = questionCategories.value;
    // console.log(categoryOfQquestion);
    selectedQuestionsDiv.hidden = true;
    selectedQuestionsDiv.innerHTML = "";

    if (categoryOfQquestion) {
      questions.hidden = false;
      questions.innerHTML = "";
      let filterQuestionbasedonCategories = QuestionsData.filter(
        (que) => que.categoryName === categoryOfQquestion
      );
      filterQuestionbasedonCategories.forEach((que) => {
        questions.innerHTML += `<option value="${que.questionId}">${que.questionText}</option>`;
      });

      selectedQuestion[id] = {
        category: categoryOfQquestion,
        questions: [],
      };
    } else {
      questions.hidden = true;
      selectedQuestionsDiv.className = "selected-questions";
      selectedQuestionsDiv.hidden = true;
      delete selectedQuestion[id];
    }
  });

  questions.addEventListener("change", (e) => {
    selectedQuestion[id].questions = Array.from(questions.selectedOptions).map(
      (que) => que.value
    );

    // console.log(selectedQuestion);

    selectedQuestionListUpdate(
      selectedQuestionsDiv,
      id,
      QuestionsData,
      letQueCategories
    );
  });

  container.appendChild(closeBtn);
  container.appendChild(questionCategories);
  container.appendChild(questions);
  container.appendChild(selectedQuestionsDiv);
  selectedQuestionDevTag.appendChild(container);
});

const selectedQuestionListUpdate = (
  container,
  id,
  questionsData,
  QuestioncategoriesData
) => {
  const questions = selectedQuestion[id];

  if (!questions) return;

  if (questions.questions.length === 0) {
    container.innerHTML = "";
    container.hidden = true;
    return;
  }

  // container.className = "selected-questions";
  // container.innerHTML = `<p>Selected Question:</p>`;
  // container.hidden = false;

  // questions.questions.forEach((que) => {
  //   const divQue = document.createElement("div");
  //   divQue.className = "question-item";
  //   divQue.innerHTML = `<div>${que}</div><button onclick="removeQuestion('${id}', '${que}','${questionsData}', '${QuestioncategoriesData}')">
  //                         &times;
  //                     </button>`;
  //   container.appendChild(divQue);
  // });
};

// const removeQuestion = (
//   id,
//   questionId,
//   questionsData,
//   QuestioncategoriesData
// ) => {
//   const que = selectedQuestion[id];
//   if (!que) return;

//   que.questions = que.questions.filter((queId) => queId !== questionId);
//   const container = document.getElementById(id);
//   const questionsDiv = container.querySelector(".selected-questions");
//   const questionsSleect = container.querySelector("select[multiple]");
//   if (que.questions.length === 0) {
//     questionsDiv.hidden = true;
//     questionsDiv.innerHTML = "";
//   }

//   Array.from(questionsSleect.options).forEach((que) => {
//     if (que.value === questionId) que.selected = false;
//   });

//   selectedQuestionListUpdate(
//     questionsDiv,
//     id,
//     questionsData,
//     QuestioncategoriesData
//   );
// };

surveyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userMappingDataInput.value = JSON.stringify(userMappingData);

  let finalData = {};

  Object.values(selectedQuestion).map(({ category, questions }) => {
    if (questions.length > 0) {
      finalData[category] = questions;
    }
  });

  selectedQuestionsInput.value = JSON.stringify(finalData);

  // console.log("Submitted data:", finalData);
  e.target.submit();
  // surveyForm.submit();
});

function userMappingSelection(selection) {
  const excel_upload = document.getElementById("excel_upload");
  const mnaulDataEntry = document.getElementById("dropdown-container");

  if (selection === "excel") {
    excel_upload.style.display = "block";
    mnaulDataEntry.style.display = "none";
    excel_upload.required = true;
  } else if (selection === "manual") {
    excel_upload.style.display = "none";
    mnaulDataEntry.style.display = "block";
    excel_upload.required = false;
  }
}
