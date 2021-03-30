;(function() {
  const maxCharacterLength = 50;

  const title = document.getElementById("title");
  title.setAttribute("maxlength", maxCharacterLength);
  title.style.paddingRight = "40px";

  title.insertAdjacentHTML("beforebegin", '<div class="charcount">' + maxCharacterLength + '</div>');
  const charCount = document.querySelector("div.charcount");

  charCount.style.borderWidth = "1px";
  charCount.style.borderStyle = "solid";
  charCount.style.borderColor = "#ddd";
  charCount.style.backgroundColor = "#f0f0f0";
  charCount.style.width = "22px";
  charCount.style.textAlign = "center";
  charCount.style.position = "absolute";
  charCount.style.right = "9px";
  charCount.style.top = "9px";
  charCount.style.fontSize = "11px";

  charCount.innerHTML = maxCharacterLength - title.value.length;

  title.addEventListener("keyup", function() {
    charCount.innerHTML = maxCharacterLength - title.value.length;
  });    
})();
