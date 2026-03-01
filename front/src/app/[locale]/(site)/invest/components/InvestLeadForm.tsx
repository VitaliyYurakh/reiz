"use client";

import { type FormEvent, useMemo, useState } from "react";
import { submitBusinessRequest } from "@/lib/api/feedback";
import CustomSelect from "@/app/[locale]/components/CustomSelect";

type Props = {
  locale: string;
};

type FeedbackState = "success" | "error" | "";

const copy = {
  ru: {
    name: "Ваше имя",
    phone: "Телефон",
    email: "E-mail",
    car: "Марка авто",
    model: "Модель",
    transmission: "Коробка передач",
    transmissionOptions: ["Автомат", "Механика", "Робот", "Вариатор"],
    year: "Год выпуска",
    mileage: "Пробег, км",
    message: "Комментарий (необязательно)",
    submit: "Передать авто в REIZ",
    submitting: "Отправляем...",
    success: "Спасибо! Мы свяжемся с вами и оценим авто.",
    error: "Не удалось отправить заявку. Попробуйте ещё раз.",
  },
  uk: {
    name: "Ваше ім'я",
    phone: "Телефон",
    email: "E-mail",
    car: "Марка авто",
    model: "Модель",
    transmission: "Коробка передач",
    transmissionOptions: ["Автомат", "Механіка", "Робот", "Варіатор"],
    year: "Рік випуску",
    mileage: "Пробіг, км",
    message: "Коментар (необов'язково)",
    submit: "Передати авто в REIZ",
    submitting: "Відправляємо...",
    success: "Дякуємо! Ми зв'яжемося з вами та оцінимо авто.",
    error: "Не вдалося відправити заявку. Спробуйте ще раз.",
  },
  en: {
    name: "Your name",
    phone: "Phone",
    email: "E-mail",
    car: "Car make",
    model: "Model",
    transmission: "Transmission",
    transmissionOptions: ["Automatic", "Manual", "Robot", "CVT"],
    year: "Year",
    mileage: "Mileage, km",
    message: "Comment (optional)",
    submit: "Submit car to REIZ",
    submitting: "Sending...",
    success: "Thank you! We will contact you and evaluate the car.",
    error: "Failed to submit request. Please try again.",
  },
  pl: {
    name: "Twoje imię",
    phone: "Telefon",
    email: "E-mail",
    car: "Marka auta",
    model: "Model",
    transmission: "Skrzynia biegów",
    transmissionOptions: ["Automat", "Manualna", "Robot", "CVT"],
    year: "Rok produkcji",
    mileage: "Przebieg, km",
    message: "Komentarz (opcjonalnie)",
    submit: "Przekaż auto do REIZ",
    submitting: "Wysyłanie...",
    success: "Dziękujemy! Skontaktujemy się z Tobą i ocenimy auto.",
    error: "Nie udało się wysłać wniosku. Spróbuj ponownie.",
  },
  ro: {
    name: "Numele tău",
    phone: "Telefon",
    email: "E-mail",
    car: "Marca mașinii",
    model: "Model",
    transmission: "Cutie de viteze",
    transmissionOptions: ["Automată", "Manuală", "Robot", "CVT"],
    year: "Anul fabricației",
    mileage: "Kilometraj, km",
    message: "Comentariu (opțional)",
    submit: "Predă mașina la REIZ",
    submitting: "Se trimite...",
    success: "Mulțumim! Vă vom contacta și vom evalua mașina.",
    error: "Nu s-a putut trimite cererea. Încercați din nou.",
  },
} as const;

export default function InvestLeadForm({ locale }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>("");
  const [transmission, setTransmission] = useState<string | null>(null);

  const text = useMemo(() => {
    return copy[locale as keyof typeof copy] ?? copy.en;
  }, [locale]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const car =
      `${formData.get("car") ?? ""} ${formData.get("model") ?? ""}`.trim();
    const transmissionVal = (formData.get("transmission") as string) || "-";
    const year = (formData.get("year") as string) || "-";
    const mileage = (formData.get("mileage") as string) || "-";
    const comment = (formData.get("message") as string) || "";

    setIsSubmitting(true);
    setFeedback("");

    try {
      await submitBusinessRequest({
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        message: `Fleet owner lead. Car: ${car}. Transmission: ${transmissionVal}. Year: ${year}. Mileage: ${mileage}. ${comment}`,
      });

      setFeedback("success");
      setTransmission(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setFeedback("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="invest-lead-form" onSubmit={handleSubmit}>
      <label className="invest-lead-form__label">
        <input name="name" type="text" required placeholder={text.name} />
      </label>
      <label className="invest-lead-form__label">
        <input name="phone" type="tel" required placeholder={text.phone} />
      </label>
      <label className="invest-lead-form__label">
        <input name="email" type="email" required placeholder={text.email} />
      </label>
      <label className="invest-lead-form__label">
        <input name="car" type="text" required placeholder={text.car} />
      </label>
      <label className="invest-lead-form__label">
        <input name="model" type="text" required placeholder={text.model} />
      </label>
      <div className="invest-lead-form__label invest-lead-form__select">
        <input type="hidden" name="transmission" value={transmission ?? ""} />
        <CustomSelect
          options={[...text.transmissionOptions]}
          value={transmission}
          onChange={setTransmission}
          placeholder={text.transmission}
          containerClassName="invest-lead"
        />
      </div>
      <label className="invest-lead-form__label">
        <input name="year" type="text" required placeholder={text.year} />
      </label>
      <label className="invest-lead-form__label">
        <input name="mileage" type="text" placeholder={text.mileage} />
      </label>
      <label className="invest-lead-form__label invest-lead-form__label--full">
        <textarea name="message" rows={3} placeholder={text.message} />
      </label>

      {feedback === "success" && (
        <p className="invest-lead-form__feedback invest-lead-form__feedback--success">
          {text.success}
        </p>
      )}

      {feedback === "error" && (
        <p className="invest-lead-form__feedback invest-lead-form__feedback--error">
          {text.error}
        </p>
      )}

      <button
        className="main-button main-button--black"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? text.submitting : text.submit}
      </button>
    </form>
  );
}
