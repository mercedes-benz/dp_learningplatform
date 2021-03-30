<?php

vc_map([
  "name" => __("Divider", "dp"),
  "base" => "dp_divider",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
    [
      "type" => "dropdown",
      "holder" => "div",
      "class" => "",
      "heading" => __("Margins", "dp"),
      "param_name" => "margins",
      "description" => __("Margins before or after divider", "dp"),
      "value" => [
        __("No margin", "dp") => "no-margin",
        __("Margin top", "dp") => "margin-top",
        __("Margin bottom", "dp") => "margin-bottom",
        __("Margin top/bottom", "dp") => "margin-both",
      ]
    ]
  ],
]);

class WPBakeryShortCode_DP_Divider extends WPBakeryShortCode {}
