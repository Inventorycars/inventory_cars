// app/assets/javascripts/application.js

import 'bootstrap';
import Rails from "@rails/ujs";

import "@hotwired/turbo-rails"
import "./controllers"
import "./add_jquery"
import 'flowbite';
import "flowbite/dist/flowbite.turbo.js";
Turbo.session.drive = false


Rails.start();
Turbolinks.start();
ActiveStorage.start();
import * as bootstrap from "bootstrap"
