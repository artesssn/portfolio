const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    projectCards.forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

const shareStatus = document.querySelector(".share-status");

function updateShareStatus(message) {
  if (!shareStatus) {
    return;
  }

  shareStatus.textContent = message;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "absolute";
  helper.style.left = "-9999px";
  document.body.appendChild(helper);
  helper.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(helper);
  return copied;
}

const profilePitch =
  "Confira o portfólio de João Gabriel, desenvolvedor em formação focado em sistemas, páginas web e soluções digitais. Atualize aqui seu GitHub, e-mail e link publicado para compartilhar com clientes.";

document.querySelectorAll("[data-action='download']").forEach((button) => {
  button.addEventListener("click", () => {
    updateShareStatus("Abrindo a versão para salvar em PDF.");
    window.print();
  });
});

document.querySelectorAll("[data-action='share']").forEach((button) => {
  button.addEventListener("click", async () => {
    const isLocalFile = window.location.protocol === "file:";
    const shareUrl = isLocalFile ? "" : window.location.href;

    try {
      if (navigator.share && shareUrl) {
        await navigator.share({
          title: document.title,
          text: profilePitch,
          url: shareUrl
        });
        updateShareStatus("Perfil compartilhado com sucesso.");
        return;
      }

      const fallbackText = shareUrl ? `${profilePitch}\n${shareUrl}` : profilePitch;
      const copied = await copyText(fallbackText);

      if (copied) {
        updateShareStatus(
          isLocalFile
            ? "Copiei uma apresentação do perfil. Quando publicar o site, esse botão também poderá compartilhar o link."
            : "Copiei a mensagem de apresentação com o link do site."
        );
      } else {
        updateShareStatus("Não consegui copiar automaticamente. Tente novamente depois de publicar o site.");
      }
    } catch (error) {
      updateShareStatus("O compartilhamento não foi concluído. Tente novamente depois de publicar o site.");
    }
  });
});

const counters = document.querySelectorAll("[data-count]");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 1000;
      const startTime = performance.now();

      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent = value.toString();

        if (progress < 1) {
          requestAnimationFrame(animate);
          return;
        }

        if (target === 100) {
          element.textContent = "100";
        }
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(element);
    });
  },
  {
    threshold: 0.5
  }
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sectionTargets = Array.from(document.querySelectorAll("section[id], footer[id]"));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const currentId = `#${entry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === currentId);
      });
    });
  },
  {
    rootMargin: "-30% 0px -55% 0px",
    threshold: 0.1
  }
);

sectionTargets.forEach((section) => {
  sectionObserver.observe(section);
});

const interactiveCards = document.querySelectorAll(".interactive-card");

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 900) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    const rotateY = ((offsetX / bounds.width) - 0.5) * 8;
    const rotateX = ((offsetY / bounds.height) - 0.5) * -8;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
