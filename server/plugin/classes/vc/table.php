<?php

vc_map([
  "name" => __("Tabelle (x-cols)", "dp"),
  "base" => "dp_table",
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
        __("Cyan", "dp") => "cyan",
        __("Purple", "dp") => "purple",
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
      "value" => __("<table style='border-collapse: collapse; width: 100%;' border='1' data-mce-style='border-collapse: collapse; width: 100%;' data-mce-selected='1'><tbody><tr><th>I am bold first col</th><td>I am ordinary content col</td></tr></tbody></table>", "dp"),
    ]
  ],
]);

class WPBakeryShortCode_DP_Table extends WPBakeryShortCode {}
