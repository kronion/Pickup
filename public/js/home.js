$('.options li').hover(
  function () {
    $(this).addClass('pure-menu-selected');
  },
  function () {
    $(this).removeClass('pure-menu-selected');
  }
);

$('.select').click(function (e) {
  e.preventDefault();
  $(this).css({ 'visibility': 'hidden'}); 
  $.get($('.select').attr('href'));
});
