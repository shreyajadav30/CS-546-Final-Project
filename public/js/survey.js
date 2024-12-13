const start = document.getElementById("startDate");
const end = document.getElementById("endDate");

const surveyForm = document.getElementById("survey-form");
const addSurveyForBtn = document.getElementById("addSurveyFor");

const userDropDown = document.getElementById("userDropDown");
const selectedSurveyForUser = document.getElementById("selectedSurveyForUser");

const dropdown_container = document.getElementById("dropdown-container");

const userMappingDataInput = document.getElementById("userMappingData");

let isSurveyForClicked = false;
let isSurveyByClicked = false;

const GET_ALL_USERS_URL = "http://localhost:3000/users/getAllUsers";

start.addEventListener("change", function () {
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

// selectAll.addEventListener("change", function () {
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

function addSubUserToList(_id, accordionItem, selectedUser) {
  const surveyByList = accordionItem.querySelector(".surveyby-list");
  const surveyByEle = document.createElement("div");
  surveyByEle.className = "surveyByUser-item";
  surveyByEle.innerHTML = `
            <span>${selectedUser.firstName} ${selectedUser.lastName}</span>
            <button type="button" class="remove-btn">Remove</button>
        `;

  userMappingData[_id].push(selectedUser._id);

  surveyByEle
    .querySelector(".remove-btn")
    .addEventListener("click", function () {
      surveyByList.removeChild(surveyByEle);
      userMappingData[_id] = userMappingData[_id].filter(
        (id) => id !== selectedUser._id
      );
    });

  surveyByList.appendChild(surveyByEle);
}

const addUserToList = async (user) => {
  const accordionItem = document.createElement("div");
  accordionItem.className = "accordion-item";
  accordionItem.innerHTML = `
            <div class="accordion-header">
                <span>${user.firstName} ${user.lastName}</span>
                <button type="button" class="add-surveyby">+ Add Survey By</button>
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
    .addEventListener("click", function (e) {
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

surveyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  userMappingDataInput.value = JSON.stringify(userMappingData);
  e.target.submit();
  // surveyForm.submit();
});
