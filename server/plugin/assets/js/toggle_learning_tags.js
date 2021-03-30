;(function() {
  const isLearningTaxonomy = document.body.classList.contains("taxonomy-learning_topic");

  const onChange = function() {
    const tags = document.body.querySelector("[data-name='learning_tag']");

    if(this.value != -1) {
      tags.style.display = "table-row";
    } else {
      tags.style.display = "none";
    }
  };

  if(isLearningTaxonomy) {
    const parent = document.getElementById("parent");

    // initially hide if necessary
    onChange.call(parent);

    // hide on change
    parent.addEventListener("change", onChange);
  }

})();
