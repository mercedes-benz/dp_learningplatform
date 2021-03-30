<?php

vc_map([
  "name" => __("List", "dp"),
  "base" => "dp_list",
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
      "class" => "",
      "heading" => __("Headline", "dp"),
      "param_name" => "headline",
    ],
    [
      "type" => "param_group",
      "value" => "",
      "param_name" => "text_col_1",
      "heading" => __("Text Column 1", "dp"),
      "params" => [
        [
          "type" => "textfield",
          "holder" => "div",
          "value" => "",
          "heading" => __("List item", "dp"),
          "param_name" => "text_col_1_item",
        ]
      ]
    ],
    [
      "type" => "param_group",
      "value" => "",
      "param_name" => "text_col_2",
      "heading" => __("Text Column 2", "dp"),
      "params" => [
        [
          "type" => "textfield",
          "holder" => "div",
          "value" => "",
          "heading" => __("List item", "dp"),
          "param_name" => "text_col_2_item",
        ]
      ]
    ]
  ]
]);

class WPBakeryShortCode_DP_List extends WPBakeryShortCode {}
