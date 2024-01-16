import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    $('#loading-bar').hide();
    $(document).on('turbo:loading', function() {
      $('#loading-bar').show();
      $('#progress').css('width', '20%');
    });

    $(document).on('turbo:streamElementReceived', function() {
      $('#loading-bar').show();
      $('#progress').css('width', '70%');
    });

    $(document).on('turbo:loading', function() {
      $('#loading-bar').show();
      $('#progress').css('width', '90%');
    });

    $(document).on('turbo:load', function() {
      // Hide the loading bar when TurboStream load is complete
      $('#loading-bar').hide();
    });

    $("#toast-alert").delay(5000).fadeOut(300);
  }
}
