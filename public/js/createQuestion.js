document.addEventListener('DOMContentLoaded', () => {
	const categorySelect = document.getElementById('category');
	const newQuestionCategory = document.getElementById(
		'new_question_category'
	);
	const optionsList = document.getElementById('options_list');
	const addOptionButton = document.getElementById('add_option');

	const toggleDeleteButtons = () => {
		const deleteButtons = document.querySelectorAll('.delete-option');
		const optionsCount = optionsList.children.length;

		deleteButtons.forEach((button) => {
			button.disabled = optionsCount <= 2;
		});
	};

	if (optionsList) toggleDeleteButtons();

	if (categorySelect && newQuestionCategory) {
		categorySelect.addEventListener('change', () => {
			if (categorySelect.value === 'other') {
				newQuestionCategory.style.display = 'block';
			} else {
				newQuestionCategory.style.display = 'none';
			}
		});
	}

	if (addOptionButton && optionsList) {
		addOptionButton.addEventListener('click', () => {
			const newOptionIndex = optionsList.children.length;
			const newOption = document.createElement('li');
			newOption.id = `option_${newOptionIndex}`;

			newOption.innerHTML = `
				<label for="option_input_${newOptionIndex}">Option ${
				newOptionIndex + 1
			}:</label>
				<input
					type="text"
					id="option_input_${newOptionIndex}"
					name="options[]"
					required
				/>
				<button type="button" class="delete-option" data-index="${newOptionIndex}">Delete</button>
			`;

			optionsList.appendChild(newOption);

			const deleteButton = newOption.querySelector('.delete-option');
			deleteButton.addEventListener('click', () => {
				newOption.remove();
				toggleDeleteButtons();
			});

			toggleDeleteButtons();
		});
	}

	optionsList?.addEventListener('click', (event) => {
		if (event.target.classList.contains('delete-option')) {
			const optionItem = event.target.closest('li');
			optionItem.remove();
			toggleDeleteButtons();
		}
	});
});
