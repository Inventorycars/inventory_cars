import { Controller } from "@hotwired/stimulus"
import TomSelect from "tom-select"

export default class extends Controller {
  connect() {
    let blockEmpty = this.element.dataset.blockEmpty === 'true';
    const config = {
      allowEmptyOption: !blockEmpty,
    };
    let ts =  new TomSelect(this.element, config);
  }
}
