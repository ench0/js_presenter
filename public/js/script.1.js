// semantic
  $(document)
    .ready(function() {

      // fix menu when passed
      $('.masthead')
        .visibility({
          once: false,
          onBottomPassed: function() {
            $('.fixed.menu').transition('fade in');
          },
          onBottomPassedReverse: function() {
            $('.fixed.menu').transition('fade out');
          }
        })
      ;

      // fix menu when passed
      $('.masthead2')
        .visibility({
          once: false,
          onBottomPassed: function() {
            $('.fixed.menu').transition('fade in');
          },
          onBottomPassedReverse: function() {
            $('.fixed.menu').transition('fade out');
          }
        })
      ;

      // create sidebar and attach to menu open
      $('.ui.vertical.sidebar')
        .sidebar('attach events', '.toc.item')
      ;

    })
  ;




$('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;



$('.tag .delete')
  .on('click', function() {
    $(this)
    .closest('.tag')
    .transition('fade')
    .delay(1000)
    .queue(function(){
      $(this).closest('.tag').remove()
      .dequeue();
    });
  });



$('.ui.dropdown')
  .dropdown({
    allowAdditions: true
  })
;

// $('.ui.accordion')
//   .accordion()
// ;



$('.ui.accordion')
  .accordion({
    selector: {
      trigger: ('.title label', '.title .icon')
    }
  })
;






// console.log("slider!")


// slider

      $(document)
        .ready(function() {
// console.log("slider!")
            $('.slider').bxSlider({
            mode: 'vertical',//horizontal, fade
            speed: 1500,
            pause: 20000,
            pager: false,
            responsive: true,
            useCSS: true,
            //slideWidth: '720px',
            auto: true,
            controls: false
            //autoControls: true
            });

            $('.slider2').bxSlider({
            mode: 'fade',//vertical, horizontal, fade
            captions: true,
            speed: 1500,
            pause: 3000,
            pager: false,
            responsive: true,
            useCSS: true,
            //slideWidth: '720px',
            auto: true,
            //ticker: true,
            controls: false
            //autoControls: true
            });

        })
        ;