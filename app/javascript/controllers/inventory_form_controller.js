import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
  static targets = ["grid", "input"]

  connect() {
    this.inputTarget.addEventListener("change", this.loadImages.bind(this))
  }

  loadImages(event) {
    const files = event.target.files
    this.gridTarget.innerHTML = ''

    for (const file of files) {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = document.createElement('img')
        img.src = e.target.result
        img.classList.add('w-1/5', 'h-50', 'object-cover', 'm-1')
        this.gridTarget.appendChild(img)
      }

      reader.readAsDataURL(file)
    }
  }
}
