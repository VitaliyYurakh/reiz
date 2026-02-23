"use client";

import clsx from "classnames";
import { useTranslations } from "next-intl";

interface FormFeedbackProps {
  formError: string | null;
  feedback: "" | "success" | "error";
}

export default function FormFeedback({
  formError,
  feedback,
}: FormFeedbackProps) {
  const t = useTranslations("carRentPage");

  return (
    <>
      {formError && (
        <p className="rent-page-form__error" role="alert">
          {formError}
        </p>
      )}

      {feedback && (
        <p
          className={clsx("rent-page-form__feedback", {
            "rent-page-form__feedback--success":
              feedback === "success",
            "rent-page-form__feedback--error":
              feedback === "error",
          })}
          role="status"
        >
          {feedback === "success"
            ? t("notifications.success")
            : t("notifications.error")}
        </p>
      )}
    </>
  );
}
