import AmEx from "@/assets/images/payments/american-express.svg";
import CardChip from "@/assets/images/payments/card-chip.svg";
import DinersClub from "@/assets/images/payments/diners-club.svg";
import Globe from "@/assets/images/payments/Globe.svg";
import Master from "@/assets/images/payments/MasterCardWithFill.svg";
import Mir from "@/assets/images/payments/mir.svg";
import UnionPay from "@/assets/images/payments/UnionPay.svg";
import Visa from "@/assets/images/payments/Visa.svg";
import { useEffect } from "react";

const BankCard = () => {
  useEffect(() => {
    const expirationSelect = document.querySelector("[data-expiration-year]");
    const dynamicYears = document.querySelector(".dynamic-years");

    const logo: HTMLImageElement | null = document.querySelector("[data-logo]");

    const currentYear = new Date().getFullYear();

    if (expirationSelect !== null && dynamicYears === null) {
      for (let i = currentYear; i < currentYear + 11; i++) {
        const option = document.createElement("option");
        option.value = String(i);
        option.innerText = String(i);
        option.classList.add("dynamic-years");
        expirationSelect.append(option);
      }
    }

    function isConnectedInput(input: HTMLInputElement) {
      const parent = input.closest("[data-connected-inputs]");
      return input.matches("input") && parent != null;
    }

    document.addEventListener("keydown", (event) => {
      const input = event.target as HTMLInputElement;

      const key = event.key;

      if (input) {
        if (!isConnectedInput(input)) return;

        switch (key) {
          case "ArrowLeft": {
            if (input.selectionStart === 0 && input.selectionEnd === 0) {
              const prev = input.previousElementSibling as HTMLInputElement;
              if (prev) {
                prev.focus();
                prev.selectionStart = prev.value.length - 1;
                prev.selectionEnd = prev.value.length - 1;
              }

              event.preventDefault();
            }
            break;
          }

          case "ArrowRight": {
            if (
              input.selectionStart === input.value.length &&
              input.selectionEnd === input.value.length
            ) {
              const next = input.nextElementSibling as HTMLInputElement;
              if (next) {
                next.focus();
                next.selectionStart = 1;
                next.selectionEnd = 1;
              }
              event.preventDefault();
            }
            break;
          }

          case "Delete": {
            if (
              input.selectionStart === input.value.length &&
              input.selectionEnd === input.value.length
            ) {
              const next = input.nextElementSibling as HTMLInputElement;
              next.value = next.value.substring(1, next.value.length);
              next.focus();
              next.selectionStart = 0;
              next.selectionEnd = 0;
              event.preventDefault();
            }
            break;
          }

          case "Backspace": {
            if (input.selectionStart === 0 && input.selectionEnd === 0) {
              const prev = input.previousElementSibling as HTMLInputElement;
              prev.value = prev.value.substring(0, prev.value.length - 1);
              prev.focus();
              prev.selectionStart = prev.value.length;
              prev.selectionEnd = prev.value.length;
              event.preventDefault();
            }
            break;
          }

          default: {
            if (event.ctrlKey || event.altKey) return;
            if (key.length > 1) return;
            if (key.match(/^[^0-9]$/)) return event.preventDefault();

            event.preventDefault();
            onInputChange(input, key);
          }
        }
      }
    });

    document.addEventListener("paste", (event) => {
      const input = event.target as HTMLInputElement;

      if (input && event.clipboardData) {
        const data = event.clipboardData.getData("text");
        console.log("🚀 ~ BankCard ~ data:", data);

        if (!isConnectedInput(input)) return;

        if (data && !data.match(/^[0-9]+$/)) return event.preventDefault();

        event.preventDefault();
        onInputChange(input, data);
      }
    });

    function onInputChange(input: HTMLInputElement, newValue: string) {
      const start = input.selectionStart;
      const end = input.selectionEnd;

      if (start != null && end != null) {
        updateInputValue(input, newValue, start, end);

        focusInput(input, newValue.length + start);

        const firstFour = input
          .closest("[data-connected-inputs]")
          ?.querySelector("input")?.value;

        if (firstFour && firstFour.startsWith("4") && logo) {
          logo.src = Visa;
        } else if (firstFour && firstFour.startsWith("5") && logo) {
          logo.src = Master;
        } else if (
          firstFour &&
          (firstFour.startsWith("34") || firstFour.startsWith("37")) &&
          logo
        ) {
          logo.src = AmEx;
        } else if (
          firstFour &&
          (firstFour.startsWith("30") ||
            firstFour.startsWith("36") ||
            firstFour.startsWith("38") ||
            firstFour.startsWith("39")) &&
          logo
        ) {
          logo.src = DinersClub;
        } else if (
          firstFour &&
          (firstFour.startsWith("2200") ||
            firstFour.startsWith("2201") ||
            firstFour.startsWith("2202") ||
            firstFour.startsWith("2203") ||
            firstFour.startsWith("2204")) &&
          logo
        ) {
          logo.src = Mir;
        } else if (firstFour && firstFour.startsWith("62") && logo) {
          logo.src = UnionPay;
        } else if (firstFour && logo) {
          logo.src = Globe;
        }
      }
    }

    function updateInputValue(
      input: HTMLInputElement,
      extraValue: string,
      start = 0,
      end = 0,
    ) {
      const newValue = `${input.value.substring(
        0,
        start,
      )}${extraValue}${input.value.substring(end, 4)}`;

      input.value = newValue.substring(0, 4);

      if (newValue.length > 4) {
        const next = input.nextElementSibling as HTMLInputElement;
        if (next == null) return;
        updateInputValue(next, newValue.substring(4));
      }
    }

    function focusInput(input: HTMLInputElement, dataLength: number) {
      let addedChars = dataLength;
      let currentInput = input;

      while (addedChars > 4 && currentInput.nextElementSibling != null) {
        addedChars -= 4;
        currentInput = currentInput.nextElementSibling as HTMLInputElement;
      }

      if (addedChars > 4) addedChars = 4;

      currentInput.focus();
      currentInput.selectionStart = addedChars;
      currentInput.selectionEnd = addedChars;
    }
  }, []);

  return (
    <div className="my-20">
      <form className="text-white relative">
        {/* --------- Front side of the card --------- */}
        <div
          className="bg-myMainColorDark border-2 border-myMainColorDarker
          rounded-2xl w-[420px] h-[265px] p-8
          flex flex-col gap-2 z-1 overflow-hidden relative
          before:content-[''] before:absolute before:h-[600px] before:w-[600px]
          before:rounded-[100%] before:bg-myMainColorLighter/50 before:-z-1
          before:-top-[380px] before:-left-[250px]
          after:content-[''] after:absolute after:h-[700px] after:w-[700px]
          after:rounded-[100%] after:bg-myMainColorLight/50 after:-z-1
          after:-bottom-[520px] after:-left-[200px]"
        >
          <div className="flex justify-between items-center mb-auto">
            <img
              className="grow-0 h-[40px] w-auto"
              src={CardChip}
              alt="Card chip"
            />

            <img
              data-logo
              src={Globe}
              className="h-[40px] w-auto"
              alt="Card Logo"
            />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="invisible h-0 w-0 absolute -top-[200vh]">
              Card Number
            </legend>
            <label htmlFor="cc-1" className="uppercase text-sm">
              Card Number
            </label>
            <div
              data-connected-inputs
              className="flex gap-5 text-myMainColorDarker text-lg"
            >
              <input
                type="tel"
                maxLength={4}
                aria-label="Credit Card First 4 Digits"
                id="cc-1"
                required
                pattern="[0-9]{4}"
                className="bg-white font-mono w-[5ch] rounded-xs p-1
                focus:outline-3 focus:outline-offset-3 focus:outline-white"
              />
              <input
                type="tel"
                maxLength={4}
                aria-label="Credit Card Second 4 Digits"
                required
                pattern="[0-9]{4}"
                className="bg-white font-mono w-[5ch] rounded-xs p-1
                focus:outline-3 focus:outline-offset-3 focus:outline-white"
              />
              <input
                type="tel"
                maxLength={4}
                aria-label="Credit Card Third 4 Digits"
                required
                pattern="[0-9]{4}"
                className="bg-white font-mono w-[5ch] rounded-xs p-1
                focus:outline-3 focus:outline-offset-3 focus:outline-white"
              />
              <input
                type="tel"
                maxLength={4}
                aria-label="Credit Card Last 4 Digits"
                required
                pattern="[0-9]{4}"
                className="bg-white font-mono w-[5ch] rounded-xs p-1
                focus:outline-3 focus:outline-offset-3 focus:outline-white"
              />
            </div>
          </fieldset>

          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-2 grow-1 mr-4">
              <label htmlFor="name" className="uppercase text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                className="bg-white text-myMainColorDarker rounded-xs p-1
                focus:outline-3 focus:outline-offset-3 focus:outline-white"
              />
            </div>

            <fieldset className="flex flex-col justify-between gap-2">
              <legend className="invisible h-0 w-0 absolute -top-[200vh]">
                Expiration
              </legend>
              <label
                htmlFor="expiration-month"
                className="uppercase text-sm text-center"
              >
                Expiration
              </label>
              <div className="flex gap-2">
                <select
                  id="expiration-month"
                  aria-label="Expiration Month"
                  required
                  className="bg-white rounded-xs text-myMainColorDarker p-1
                  rounded-xs appearance-none
                  focus:outline-3 focus:outline-offset-3 focus:outline-white"
                >
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
                <select
                  id="expiration-year"
                  aria-label="Expiration Year"
                  required
                  data-expiration-year
                  className="bg-white rounded-xs text-myMainColorDarker p-1
                  rounded-xs appearance-none
                  focus:outline-3 focus:outline-offset-3 focus:outline-white
                  data-expiration-year"
                ></select>
              </div>
            </fieldset>
          </div>
        </div>
        {/* --------- Back side of the card --------- */}
        <div
          className="bg-myMainColorDark border-2 border-myMainColorDarker
          rounded-2xl w-[420px] h-[265px] p-8 absolute top-[2rem] left-[4rem]"
        >
          <div
            className="bg-black h-[60px] absolute left-0 right-0
            top-[1.5rem]"
          ></div>
          <div
            className="flex flex-col justify-between gap-2
            absolute bottom-[3.9rem] right-[0.5rem]"
          >
            <label htmlFor="cvc" className="uppercase text-sm">
              CVC
            </label>
            <input
              className="bg-white text-myMainColorDarker rounded-xs p-1
              font-mono w-[4ch] mr-2
              focus:outline-3 focus:outline-offset-3 focus:outline-white"
              type="tel"
              maxLength={3}
              id="cvc"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BankCard;
