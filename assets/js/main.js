const form = document.querySelector("form");
const billInput = document.querySelector("input#bill");
const selectableTipsInputs = document.querySelectorAll('input[type="radio"]');
const customTipInput = document.querySelector("input#tipPorcentCustom");
const numberOfPeopleInput = document.querySelector("input#numberOfPeople");
const resetButton = document.querySelector('button[type="reset"]');
const tipAmount = document.querySelector("#tipAmount");
const totalAmount = document.querySelector("#totalAmount");
const labelError = document.querySelector(".tip-calc__field__label__error");

function calculate() {
    // console.log(Object.fromEntries(new FormData(form).entries()));

    const formData = new FormData(form);
    const bill = formatCurrencyToNumber(formData.get("bill"));
    const numberOfPeople = Number(formData.get("numberOfPeople"));
    const tipPorcent = Number(formData.get("tipPorcent"));
    const tipPorcentCustom = Number(formData.get("tipPorcentCustom"));

    if (!bill || !numberOfPeople || (!tipPorcent && !tipPorcentCustom)) {
        return clearResults();
    }

    const tip = tipPorcent || tipPorcentCustom;
    const total = bill * (1 + tip / 100);
    const tipAmountPerPerson = ((bill * (tip / 100)) / numberOfPeople).toFixed(
        2
    );
    const totalAmountPerPerson = (total / numberOfPeople).toFixed(2);

    tipAmount.innerHTML = `$${tipAmountPerPerson}`;
    totalAmount.innerHTML = `$${totalAmountPerPerson}`;
}

function clearResults() {
    tipAmount.innerHTML = "$0.00";
    totalAmount.innerHTML = "$0.00";
}

function onInputChange() {
    resetButton.disabled = false;
    calculate();
}

function formatCurrencyToNumber(value) {
    return Number(value.replace(/[^0-9.]+/g, ""));
}

function formatNumberToCurrency(value) {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

customTipInput.addEventListener("change", () => {
    selectableTipsInputs.forEach((input) => (input.checked = false));
    onInputChange();
});

selectableTipsInputs.forEach((tip) => {
    tip.addEventListener("change", () => {
        customTipInput.value = null;
        onInputChange();
    });
});

billInput.addEventListener("change", onInputChange);
billInput.addEventListener("focus", ({ target }) => {
    const value = target.value;
    target.value = formatCurrencyToNumber(value);
    target.select();
});
billInput.addEventListener("blur", ({ target }) => {
    const value = Number(target.value) || 0;
    target.value = formatNumberToCurrency(value);
});

numberOfPeopleInput.addEventListener("change", ({ target }) => {
    const value = Number(target.value);
    if (value === 0) {
        target.classList.add("error")
        labelError.textContent = "Can't be zero";
    } else {
        target.classList.remove("error");
        labelError.textContent = "";   
    }

    target.value = Math.floor(value);
    onInputChange();
});

resetButton.addEventListener("click", () => {
    resetButton.disabled = true;
    clearResults();
    form.reset();
});
