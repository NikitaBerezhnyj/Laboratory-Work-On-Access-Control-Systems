// Об'єкт з правилами валідації
const validationRules = {
  firstName: {
    validate: (value) => {
      const nameRegex =
        /^[A-ZАБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ][a-zабвгґдеєжзиіїйклмнопрстуфхцчшщьюя]+$/;
      return {
        isValid: nameRegex.test(value),
        errorMessage:
          "Ім'я має починатися з великої літери та містити лише українські чи англійські літери",
      };
    },
  },
  lastName: {
    validate: (value) => {
      const nameRegex =
        /^[A-ZАБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ][a-zабвгґдеєжзиіїйклмнопрстуфхцчшщьюя]+$/;
      return {
        isValid: nameRegex.test(value),
        errorMessage:
          "Прізвище має починатися з великої літери та містити лише українські чи англійські літери",
      };
    },
  },
  email: {
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return {
        isValid: emailRegex.test(value),
        errorMessage: "Невірний формат електронної пошти",
      };
    },
  },
  password: {
    validate: (value) => {
      const uppercaseRegex = /[A-Z]/;
      const lowercaseRegex = /[a-z]/;
      const numberRegex = /[0-9]/;
      const specialCharRegex = /[!@#$%^&*]/;

      const errors = [];

      if (value.length < 8) {
        errors.push("Пароль має бути мінімум 8 символів");
      }
      if (!uppercaseRegex.test(value)) {
        errors.push("Має містити щонайменше одну велику літеру");
      }
      if (!lowercaseRegex.test(value)) {
        errors.push("Має містити щонайменше одну малу літеру");
      }
      if (!numberRegex.test(value)) {
        errors.push("Має містити щонайменше одну цифру");
      }
      if (!specialCharRegex.test(value)) {
        errors.push(
          "Має містити щонайменше один спеціальний символ (!@#$%^&*)"
        );
      }

      return {
        isValid: errors.length === 0,
        errorMessage: errors.join(", "),
      };
    },
  },
};

// Клас валідації форми
class FormValidator {
  constructor(formId, rules) {
    this.form = document.getElementById(formId);
    this.rules = rules;
    this.submitButton = this.form.querySelector('button[type="submit"]');
    this.showPasswordCheckbox = this.form.querySelector("#showPassword");

    this.initEventListeners();
  }

  initEventListeners() {
    // Жива валідація
    Object.keys(this.rules).forEach((fieldName) => {
      const field = this.form.querySelector(`#${fieldName}`);
      field.addEventListener("input", () => this.validateField(fieldName));
    });

    // Показати/приховати пароль
    this.showPasswordCheckbox.addEventListener("change", () => {
      const passwordField = this.form.querySelector("#password");
      passwordField.type = this.showPasswordCheckbox.checked
        ? "text"
        : "password";
    });

    // Обробка надсилання форми
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validateAllFields()) {
        this.handleSubmit();
      }
    });
  }

  validateField(fieldName) {
    const field = this.form.querySelector(`#${fieldName}`);
    const errorElement = this.form.querySelector(`#${fieldName}Error`);
    const { isValid, errorMessage } = this.rules[fieldName].validate(
      field.value
    );

    if (isValid) {
      field.classList.remove("invalid");
      field.classList.add("valid");
      errorElement.textContent = "";
    } else {
      field.classList.remove("valid");
      field.classList.add("invalid");
      errorElement.textContent = errorMessage;
    }

    this.toggleSubmitButton();
  }

  validateAllFields() {
    let isFormValid = true;

    Object.keys(this.rules).forEach((fieldName) => {
      const field = this.form.querySelector(`#${fieldName}`);
      const { isValid } = this.rules[fieldName].validate(field.value);

      if (!isValid) {
        isFormValid = false;
        this.validateField(fieldName);
      }
    });

    return isFormValid;
  }

  toggleSubmitButton() {
    const fields = Object.keys(this.rules).map((fieldName) =>
      this.form.querySelector(`#${fieldName}`)
    );

    const allFieldsFilled = fields.every((field) => field.value.trim() !== "");
    const allFieldsValid = fields.every((field) =>
      field.classList.contains("valid")
    );

    this.submitButton.disabled = !(allFieldsFilled && allFieldsValid);
  }

  handleSubmit() {
    const formData = {};
    Object.keys(this.rules).forEach((fieldName) => {
      const field = this.form.querySelector(`#${fieldName}`);
      formData[fieldName] = field.value;
    });

    console.log("Форма надіслана:", formData);
  }
}

// Ініціалізація валідації форми
document.addEventListener("DOMContentLoaded", () => {
  new FormValidator("registrationForm", validationRules);
});
