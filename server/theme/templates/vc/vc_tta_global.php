<?php
if ( ! defined( 'ABSPATH' ) ) {
  die( '-1' );
}

/**
 * Shortcode attributes
 * @var $atts
 * @var $content - shortcode content
 * @var $el_class
 * @var $el_id
 * @var $this WPBakeryShortCode_VC_Tta_Accordion|WPBakeryShortCode_VC_Tta_Tabs|WPBakeryShortCode_VC_Tta_Tour|WPBakeryShortCode_VC_Tta_Pageable
 */
$atts = vc_map_get_attributes( $this->getShortcode(), $atts );
$this->resetVariables( $atts, $content );
extract( $atts );

// It is required to be before tabs-list-top/left/bottom/right for tabs/tours
$prepareContent = $this->getTemplateVariable( 'content' );

$output = '<div class="accordion accordion--' . $style . '">';
$output .= '<div class="accordion__panels">';
$output .= $prepareContent;
$output .= '</div>';
$output .= '</div>';

echo $output;
