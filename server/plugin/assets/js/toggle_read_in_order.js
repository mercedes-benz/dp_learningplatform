;(function() {
  const isLearningTaxonomy = document.body.classList.contains("taxonomy-learning_topic");

  const onChange = function() {
    const readInOrder = document.body.querySelector("[data-name='read_in_order']");

    if(this.value == -1) {
      readInOrder.style.display = "table-row";
    } else {
      readInOrder.style.display = "none";
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
