import AirDatepicker from "air-datepicker";

document.querySelectorAll("[data-calendar]").forEach((input) => {
  const type = input.dataset.calendar; // 'short' или 'full'

  new AirDatepicker(input, {
    range: true,
    timepicker: type === "short",
    timeFormat: "HH:mm",
    multipleDatesTime: true,
    autoClose: type !== "short",

    locale: {
      days: [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
      ],
      daysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      months: [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
      ],
      monthsShort: [
        "янв.",
        "февр.",
        "мар.",
        "апр.",
        "мая",
        "июн.",
        "июл.",
        "авг.",
        "сент.",
        "окт.",
        "нояб.",
        "дек.",
      ],
    },

    buttons: type === "short"
      ? [
          {
            content: "Применить",
            className: "custom-close-btn",
            onClick(dp) {
              dp.hide();
            },
          },
        ]
      : [],

    onShow(dp) {
      if (type === "short") {
        const nextEl = input.nextElementSibling;
        if (nextEl) nextEl.classList.add("active");
      }
    },

    onHide(dp) {
      if (type === "short") {
        const nextEl = input.nextElementSibling;
        if (nextEl) nextEl.classList.remove("active");
      }
    },

    onSelect({ date, datepicker }) {
      if (!Array.isArray(date) || date.length !== 2) return;

      const [start, end] = date;

      const formatShort = (d) => {
        const day = d.getDate();
        const month = datepicker.locale.monthsShort[d.getMonth()];
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${day} ${month} ${hours}:${minutes}`;
      };

      const formatFull = (d) => {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}.${month}.${year}`;
      };

      input.value =
        type === "short"
          ? `${formatShort(start)} — ${formatShort(end)}`
          : `${formatFull(start)} до ${formatFull(end)}`;
    },
  });
});
