<?php

vc_remove_param("vc_tta_section", "el_class");
vc_remove_param("vc_tta_section", "i_position");
vc_remove_param("vc_tta_section", "add_icon");
vc_remove_param("vc_tta_section", "i_type");
vc_remove_param("vc_tta_section", "i_icon_fontawesome");
vc_remove_param("vc_tta_section", "i_icon_openiconic");
vc_remove_param("vc_tta_section", "i_icon_typicons");
vc_remove_param("vc_tta_section", "i_icon_entypo");
vc_remove_param("vc_tta_section", "i_icon_linecons");
vc_remove_param("vc_tta_section", "i_icon_monosocial");
vc_remove_param("vc_tta_section", "i_icon_material");
vc_remove_param("vc_tta_accordion", "title");
vc_remove_param("vc_tta_accordion", "style");
vc_remove_param("vc_tta_accordion", "shape");
vc_remove_param("vc_tta_accordion", "color");
vc_remove_param("vc_tta_accordion", "no_fill");
vc_remove_param("vc_tta_accordion", "spacing");
vc_remove_param("vc_tta_accordion", "gap");
vc_remove_param("vc_tta_accordion", "c_align");
vc_remove_param("vc_tta_accordion", "autoplay");
vc_remove_param("vc_tta_accordion", "collapsible_all");
vc_remove_param("vc_tta_accordion", "c_icon");
vc_remove_param("vc_tta_accordion", "c_position");
vc_remove_param("vc_tta_accordion", "active_section");
vc_remove_param("vc_tta_accordion", "el_id");
vc_remove_param("vc_tta_accordion", "el_class");
vc_remove_param("vc_tta_accordion", "css");
vc_remove_param("vc_tta_accordion", "css_animation");

vc_add_param("vc_tta_accordion", [
  "type" => "dropdown",
  "heading" => __("Style", "dp"),
  "param_name" => "style",
  "value" => [
    __("Cyan Gradient", "dp") => "cyan",
    __("Purple Gradient", "dp") => "purple",
  ]
]);
