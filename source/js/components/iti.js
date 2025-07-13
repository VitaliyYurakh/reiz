import intlTelInput from "intl-tel-input";

const parents = document.querySelectorAll(".tel");

parents.forEach(function (parent) {
  const input = parent.querySelector("input");

  const iti = intlTelInput(input, {
    initialCountry: "ua",
    separateDialCode: true,
    preferredCountries: ["ua", "pl", "de"],
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
  });
});

