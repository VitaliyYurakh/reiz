document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".main-info").forEach((form) => {
    if (form.classList.contains("mode")) return;

    const editBtn = form.querySelector(".main-info__edit");
    const saveBtn = form.querySelector(".grey-btn");
    const inputs = form.querySelectorAll("input");
    const textareas = form.querySelectorAll("textarea");

    const updateInputWidth = (input) => {
      const span = document.createElement("span");
      span.style.position = "absolute";
      span.style.visibility = "hidden";
      span.style.whiteSpace = "pre";
      span.style.font = window.getComputedStyle(input).font;
      span.textContent = input.value || input.placeholder || "";
      document.body.appendChild(span);
      input.style.width = `${span.offsetWidth + 5}px`;
      document.body.removeChild(span);
    };

    inputs.forEach((input) => updateInputWidth(input));

    editBtn.addEventListener("click", () => {
      inputs.forEach((input) => {
        input.disabled = false;
        updateInputWidth(input);
        input.addEventListener("input", () => updateInputWidth(input));
      });

      textareas.forEach((textarea) => {
        textarea.disabled = false;
        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      });

      if (saveBtn) saveBtn.classList.remove("hidden");
    });

    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        inputs.forEach((input) => {
          input.disabled = true;
        });

        textareas.forEach((textarea) => {
          textarea.disabled = true;
        });

        saveBtn.classList.add("hidden");
      });
    }

    document.querySelectorAll("[data-upload-group]").forEach((group) => {
      const addButton = group.querySelector(".main-info__add");

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.style.display = "none";
      document.body.appendChild(fileInput);

      let isFileDialogOpen = false;

      addButton.addEventListener("click", () => {
        if (isFileDialogOpen) return;

        isFileDialogOpen = true;
        setTimeout(() => {
          fileInput.click();
        }, 0);
      });

      fileInput.addEventListener("click", () => {
        // В некоторых браузерах (особенно Chrome/macOS) событие `click` может триггериться дважды
        // Это дополнительная защита
        isFileDialogOpen = true;
      });

      fileInput.addEventListener("change", function () {
        isFileDialogOpen = false;

        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
          const items = group.querySelectorAll(".main-info__item");
          const isSingle = group
            .closest(".main-info")
            ?.classList.contains("single");

          let targetItem = null;

          if (isSingle) {
            targetItem = items[0];
            targetItem.innerHTML = ""; // перезаписываем
          } else {
            targetItem = Array.from(items).find(
              (item) => item.children.length === 0
            );
          }

          if (targetItem) {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.alt = "Загруженное фото";
            img.style.width = "100%";
            img.style.aspectRatio = "16 / 9";
            img.style.objectFit = "cover";

            targetItem.appendChild(img);
          } else {
            alert("Нет свободных ячеек для фото");
          }

          fileInput.value = "";
        };

        reader.readAsDataURL(file);
      });
    });
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    const textarea = modal.querySelector("textarea");

    if (textarea) {
      const autoResize = () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      };

      textarea.addEventListener("input", autoResize);

      autoResize();
    }
  });

  const uploadBtn = document.querySelector("[data-btn-gallery]");
  const galleryBox = document.querySelector("[data-gallery-box]");
  const maxFiles = 10;

  if (!uploadBtn || !galleryBox) return;

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.multiple = true;
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  uploadBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files);

    if (!files.length) return;

    const currentImages = galleryBox.querySelectorAll("img").length;
    if (currentImages + files.length > maxFiles) {
      alert(`Можно загрузить не более ${maxFiles} изображений`);
      return;
    }

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`Файл "${file.name}" не является изображением.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = file.name;
        img.width = 192;
        img.height = 128;
        galleryBox.appendChild(img);
      };
      reader.readAsDataURL(file);
    });

    fileInput.value = "";
  });
});
