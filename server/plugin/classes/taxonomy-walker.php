<?php

if(!class_exists("DP_Taxonomy_Walker")) {
  class DP_Taxonomy_Walker extends Walker_Category_Checklist {
      /*
       * Start the element output.
       *
       * @see Walker::start_el()
       *
       * @param string $output   Used to append additional content (passed by reference).
       * @param object $category The current term object.
       * @param int    $depth    Depth of the term in reference to parents. Default 0.
       * @param array  $args     An array of arguments. @see wp_terms_checklist()
       * @param int    $id       ID of the current term.
       */
      public function start_el( &$output, $category, $depth = 0, $args = array(), $id = 0 ) {
        if ( empty( $args['taxonomy'] ) ) {
          $taxonomy = 'category';
        } else {
          $taxonomy = $args['taxonomy'];
        }

        if ( $taxonomy == 'category' ) {
          $name = 'post_category';
        } else {
          $name = 'tax_input[' . $taxonomy . ']';
        }

        $args['popular_cats'] = [];
        $class = in_array( $category->term_id, $args['popular_cats'] ) ? ' class="popular-category"' : '';

        $args['selected_cats'] = empty( $args['selected_cats'] ) ? array() : $args['selected_cats'];

        if ( ! empty( $args['list_only'] ) || $depth === 0 ) {
          $aria_checked = 'false';
          $inner_class = 'category';

          if ( in_array( $category->term_id, $args['selected_cats'] ) ) {
            $inner_class .= ' selected';
            $aria_checked = 'true';
          }

          /** This filter is documented in wp-includes/category-template.php */
          $output .= "\n" . '<li' . $class . '>' .
            '<div class="' . $inner_class . '" data-term-id=' . $category->term_id .
            ' tabindex="0" role="checkbox" aria-checked="' . $aria_checked . '">' .
            esc_html( apply_filters( 'the_category', $category->name, '', '' ) ) . '</div>';
        } else {
          /** This filter is documented in wp-includes/category-template.php */
          $output .= "\n<li id='{$taxonomy}-{$category->term_id}'$class>" .
            '<label class="selectit"><input value="' . $category->term_id . '" type="radio" name="'.$name.'[]" id="in-'.$taxonomy.'-' . $category->term_id . '"' .
            checked( in_array( $category->term_id, $args['selected_cats'] ), true, false ) .
            disabled( empty( $args['disabled'] ), false, false ) . ' /> ' .
            esc_html( apply_filters( 'the_category', $category->name, '', '' ) ) . '</label>';
        }
      }
  }
}
