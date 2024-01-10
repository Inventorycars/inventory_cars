import { Controller } from "@hotwired/stimulus"



export default class extends Controller {
  static targets = [ "inventory" ]

  connect() {
    // console.log("Hello, Stimulus!", this.element)
  }

  inventoryTargetConnected(element) {
    // console.log("inventoryTargetConnected", element)
  }


}
