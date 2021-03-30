<?php

vc_map([
  "name" => __("Liste Wysiwyg", "dp"),
  "base" => "dp_list_wysiwyg",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
    [
      "type" => "dropdown",
      "holder" => "hidden",
      "class" => "",
      "heading" => __("Style", "dp"),
      "param_name" => "style",
      "description" => __("Color Style", "dp"),
      "value" => [
        __("Transparent", "dp") => "nobg",
        __("White", "dp") => "white",
        __("Cyan", "dp") => "cyan",
        __("Purple", "dp") => "purple",
      ]
    ],
    [
      "type" => "dropdown",
      "holder" => "hidden",
      "class" => "",
      "heading" => __("Icon", "dp"),
      "param_name" => "icon",
      "description" => __("Icon of the listitem", "dp"),
      "value" => [
        __("Dot", "dp") => "dot",
        __("Arrow", "dp") => "arrow-right",
        __("Star", "dp") => "star-circle",
      ]
    ],
    [
      "type" => "textfield",
      "holder" => "div",
      "heading" => __("Headline", "dp"),
      "param_name" => "headline",
    ],
    [
      "type" => "textarea_html",
      "holder" => "hidden",
      "heading" => __("Content", "dp"),
      "param_name" => "content",
    ]
  ],
]);

class WPBakeryShortCode_DP_List_Wysiwyg extends WPBakeryShortCode {}
