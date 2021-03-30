; (function ($, window, document, undefined) {

    function preselectFirstCategory(el) {
        if ($(el).length > 0) {
            let $categoryList = $(el);
            let $firstCategory = $categoryList.first().find('li:first-child input');
            // let $firstCategory = $firstCategoryList.find('li:first-child input');
            let isChecked = $categoryList
                .find("li input")
                .filter(':checked').length > 0
            if (!isChecked) {
                $firstCategory.prop("checked", true);
            }
        }
    }
    preselectFirstCategory('#knowledge_categorychecklist ul.children');
    preselectFirstCategory('#learning_topicchecklist ul.children');

})(jQuery, window, document)