import { Controller } from "@hotwired/stimulus"
import $ from 'jquery';
export default class extends Controller {
  connect() {
    $(".toggleDetails").on('click', function() {
      if($(".toggleDetails").html() === 'View Complete Detail'){
        $(".toggleDetails").html('View Less Detail')
      }
      else {
        $(".toggleDetails").html('View Complete Detail')
      }
      $('#detailsContainer').toggleClass('hidden');
    });
  }
}
