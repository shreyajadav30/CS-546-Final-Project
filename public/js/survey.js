const start = document.getElementById("startDate");
const end = document.getElementById('endDate');

start.addEventListener('change', function () {
  const selectedStartDate = this.value; 
  end.min = selectedStartDate;
  const today = new Date();
  console.log(today);
  if (end.value && end.value < selectedStartDate) {
    end.value = '';
  }
//   if(selectedStartDate > today){
//     const inactiveOption = dropdown.querySelector('option[value="Active"]');
//     inactiveOption.disabled = true;
//   }
});

const selectAll = document.getElementById('selectAll');
const userCheck = document.querySelectorAll('.userMapping');

selectAll.addEventListener('change', function () {
  const isChecked = this.checked; 
  
  userCheck.forEach(checkbox => {    
    checkbox.checked = isChecked;
  });
});