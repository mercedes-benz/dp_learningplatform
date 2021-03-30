<?php

vc_map([
  "name" => __("Include library article", "dp"),
  "base" => "dp_include_knowledge_article",
  "class" => "",
  "category" => __("Content", "dp"),
  "params" => [
    [
      "type" => "autocomplete",
      "holder" => "hidden",
      "heading" => __("Article", "dp"),
      "param_name" => "id",
      "settings" => [
        "groups" => true,
      ],
    ]
  ]
]);

class WPBakeryShortCode_DP_Include_Knowledge_Article extends WPBakeryShortCode {}
