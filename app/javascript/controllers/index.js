// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application"

import HelloController from "./hello_controller"
application.register("hello", HelloController)

import ProgressBarController from "./progress_bar_controller"
application.register("progress-bar", ProgressBarController)

import ShowInventoryController from "./show_inventory_controller"
application.register("show-inventory", ShowInventoryController)

import InventoriesController from "./inventories_controller"
application.register("inventories", InventoriesController)

import TomSelectController from "./tom_select_controller"
application.register("tom-select", TomSelectController)

import NavbarController from "./navbar_controller"
application.register("navbar", NavbarController)

import InventoryFormController from "./inventory_form_controller"
application.register("inventory-form", InventoryFormController)
