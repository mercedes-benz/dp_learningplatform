<?php
if ( ! defined( 'ABSPATH' ) ) {
  die( '-1' );
}

/**
 * Shortcode attributes
 * @var $atts
 * @var $content - shortcode content
 * @var $this WPBakeryShortCode_VC_Tta_Section
 */
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$this->resetVariables( $atts, $content );
WPBakeryShortCode_VC_Tta_Section::$self_count ++;
WPBakeryShortCode_VC_Tta_Section::$section_info[] = $atts;
$isPageEditable = vc_is_page_editable();

$output = '';

$output .= '<div class="accordion__panel"';
$output .= ' id="' . esc_attr( $this->getTemplateVariable( 'tab_id' ) ) . '"';
$output .= '>';
$output .= '<h3 class="accordion__panel-heading">';
$output .= $this->getTemplateVariable( 'title' );
$output .= '<i class="icon-arrow-down"></i>';
$output .= '</h3>';
$output .= '<div class="accordion__panel-body">';
$output .= $this->getTemplateVariable( 'content' );
if ( $isPageEditable ) {
  $output .= '</div>';
}
$output .= '</div>';
$output .= '</div>';

echo $output;
