let currentBaseHours = 0;
let currentPackageName = "";

const pricing = {
  tier1: { base: { 3: 1350, 4: 1650, 5: 1950, 6: 2250 }, extra: 250 },
  tier2: { base: { 3: 1950, 4: 2350, 5: 2750, 6: 3150 }, extra: 350 },
  tier3: { base: { 3: 2550, 4: 3050, 5: 3550, 6: 4050 }, extra: 450 }
};

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function selectPackage(name, hours) {
  currentPackageName = name;
  currentBaseHours = hours;

  const selectedName = document.getElementById("selected-pkg-name");
  const customizer = document.getElementById("customizer");
  const hiddenPkg = document.getElementById("selected-package");
  const hiddenHours = document.getElementById("selected-hours");

  if (selectedName) {
    selectedName.innerText = "Customize Your Service: " + name;
  }

  if (hiddenPkg) hiddenPkg.value = name;
  if (hiddenHours) hiddenHours.value = hours;

  if (customizer) {
    customizer.classList.remove("hidden");
  }

  updateEstimate();
  scrollToSection("customizer");
}

function updateEstimate() {
  if (!currentBaseHours) return;

  const guests = parseInt(document.getElementById("calc-guests")?.value, 10) || 0;
  const miles = parseInt(document.getElementById("calc-miles")?.value, 10) || 0;
  const extraHours = parseInt(document.getElementById("calc-extra-hours")?.value, 10) || 0;
  const menuUpgrade = document.getElementById("calc-menu")?.checked || false;
  const photoBooth = document.getElementById("calc-photo")?.checked || false;

  const estimateTotal = document.getElementById("estimate-total");
  const estimateDetails = document.getElementById("estimate-details");
  const formSummary = document.getElementById("form-summary");

  let tierKey = "tier1";
  let bartenders = 1;

  if (guests > 50 && guests <= 100) {
    tierKey = "tier2";
    bartenders = 2;
  } else if (guests > 100) {
    tierKey = "tier3";
    bartenders = 3;
  }

  if (guests > 150) {
    if (estimateTotal) estimateTotal.innerText = "Custom Quote";
    if (estimateDetails) {
      estimateDetails.innerText = "Events over 150 guests require custom staffing and a custom proposal.";
    }
    if (formSummary) {
      formSummary.value = `${currentPackageName} | Custom Quote Required`;
    }
    return;
  }

  let total = pricing[tierKey].base[currentBaseHours] || 0;
  total += extraHours * pricing[tierKey].extra;

  let travelFee = 0;
  if (miles > 35) {
    travelFee = 100 + ((miles - 35) * 0.5);
  }
  total += travelFee;

  if (menuUpgrade) total += 150;
  if (photoBooth) total += ((currentBaseHours + extraHours) * 100);

  const totalHours = currentBaseHours + extraHours;

  const detailText =
    `${currentPackageName} • ${totalHours} hour(s) • ${bartenders} bartender(s)` +
    ` • Travel: $${travelFee.toFixed(2)}` +
    `${menuUpgrade ? " • Custom Menu/Signage Included" : ""}` +
    `${photoBooth ? " • 360 Photo Booth Included" : ""}`;

  if (estimateTotal) estimateTotal.innerText = `$${total.toFixed(2)}`;
  if (estimateDetails) estimateDetails.innerText = detailText;
  if (formSummary) {
    formSummary.value = `Package: ${currentPackageName}
Base Hours: ${currentBaseHours}
Extra Hours: ${extraHours}
Guest Count: ${guests}
Miles from Malvern: ${miles}
Custom Menu/Signage: ${menuUpgrade ? "Yes" : "No"}
360 Photo Booth: ${photoBooth ? "Yes" : "No"}
Estimated Total: $${total.toFixed(2)}
Details: ${detailText}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const inquiryForm = document.getElementById("inquiry-form");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("inq-name")?.value.trim() || "";
      const email = document.getElementById("inq-email")?.value.trim() || "";
      const phone = document.getElementById("inq-phone")?.value.trim() || "";
      const eventDate = document.getElementById("inq-date")?.value || "";
      const message = document.getElementById("inq-message")?.value.trim() || "";
      const summary = document.getElementById("form-summary")?.value || "No estimate included.";

      const subject = `Black Tie Affair Inquiry - ${name || "New Client"}`;
      const body = `Hello,

I would like to request availability for my event.

Name: ${name}
Email: ${email}
Phone: ${phone}
Event Date: ${eventDate}

Service Details:
${summary}

Additional Notes:
${message}
`;

      const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent("rosescollege1@gmail.com")}` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      window.open(gmailUrl, "_blank");
    });
  }
});