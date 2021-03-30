<?php

function dp_add_editor_styles() {
  add_editor_style();
}

add_action("admin_init", "dp_add_editor_styles");
