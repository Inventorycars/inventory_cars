import { Controller } from "@hotwired/stimulus"

export default class extends Controller {

  static targets = [ "secondElement" ]

  connect() {}

  secondElementTargetConnected() {
    this.secondElementTarget.style.top = `${$('nav').height()}px`;
  }

}
