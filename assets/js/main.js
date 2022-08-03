const form = document.querySelector("form");
const billInput = document.querySelector("input#bill");
const selectableTipsInputs = document.querySelectorAll('input[type="radio"]');
const customTipInput = document.querySelector("input#tipPorcentCustom");
const numberOfPeopleInput = document.querySelector("input#numberOfPeople");
const resetButton = document.querySelector('button[type="reset"]');
const tipAmount = document.querySelector("#tipAmount");
const totalAmount = document.querySelector("#totalAmount");

function calculate() {
    console.log(Object.fromEntries(new FormData(form).entries()));
    const { bill, numberOfPeople, tipPorcent, tipPorcentCustom } =
        Object.fromEntries(new FormData(form).entries());

    if (!bill || !numberOfPeople || (!tipPorcent && !tipPorcentCustom)) {
        return;
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

function onInputChange() {
    resetButton.disabled = false;
    calculate();
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

function formatCurrencyToNumber(value) {
    return Number(value.replace(/[^0-9.]+/g, ""));
}

function formatNumberToCurrency(value) {
    return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

billInput.addEventListener("change", ({ target }) => {
    if (!Number.isNaN(Number(target.value))) {
        onInputChange();
    }
});
billInput.addEventListener("focus", ({ target }) => {
    const value = target.value;
    target.value = formatCurrencyToNumber(value);
});
billInput.addEventListener("blur", ({ target }) => {
    const value = Number(target.value) || 0;
    target.value = formatNumberToCurrency(value);
});
numberOfPeopleInput.addEventListener("change", onInputChange);

resetButton.addEventListener("click", () => {
    resetButton.disabled = true;
    form.reset();
});
