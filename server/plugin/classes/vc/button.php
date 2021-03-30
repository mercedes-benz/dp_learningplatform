<?php

vc_map([
  "name" => __("Button", "dp"),
  "base" => "dp_button",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
    [
      "type" => "textfield",
      "holder" => "div",
      "heading" => __("Text", "dp"),
      "param_name" => "text",
    ],
    [
      "type" => "vc_link",
      "holder" => "hidden",
      "heading" => __("Link", "dp"),
      "param_name" => "link",
    ],
    [
      "type" => "dropdown",
      "holder" => "hidden",
      "class" => "",
      "heading" => __("Style", "dp"),
      "param_name" => "style",
      "value" => [
        __("Light", "dp") => "light",
        __("Dark", "dp") => "dark",
        __("Cyan Gradient", "dp") => "cyan",
        __("Purple Gradient", "dp") => "purple",
      ]
    ],
    [
      "type" => "dropdown",
      "holder" => "hidden",
      "heading" => __("Size", "dp"),
      "param_name" => "size",
      "value" => [
        __("small", "dp") => "small",
        __("medium", "dp") => "medium",
        __("large", "dp") => "large",
      ]
    ],
    [
      "type" => "checkbox",
      "holder" => "hidden",
      "heading" => __("Outline", "dp"),
      "param_name" => "outline",
      "description" => __("Ghost button", "dp"),
    ],
    [
      "type" => "dropdown",
      "holder" => "hidden",
      "class" => "",
      "heading" => __("Alignment", "dp"),
      "param_name" => "alignment",
      "value" => [
        __("Inline", "dp") => "inline",
        __("Left", "dp") => "left",
        __("Right", "dp") => "right",
        __("Center", "dp") => "center",
      ]
    ],
    [
      "type" => "dropdown",
      "holder" => "hidden",
      "heading" => __("Icon", "dp"),
      "param_name" => "icon",
      "value" => [
        __("Default", "dp") => "default",
        __("Link", "dp") => "link",
        __("Download", "dp") => "download",
        __("None", "dp") => "none",
      ]
    ]
  ]
]);

class WPBakeryShortCode_DP_Button extends WPBakeryShortCode {}
