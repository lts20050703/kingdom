$(function () {
  // Check for saved color preference
  function getCookie (name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
  }
  if (getCookie('color')) {
    const currentColor = getCookie('color')
    $(`[data-color=${currentColor}]`).addClass('active')
    $('#theme-color').attr('href', `https://kingdoms.reals.tech/assets/css/${currentColor}.css`)
  } else {
    $('[data-color=default]').addClass('active')
  }
  // init feather icons
  feather.replace()

  // init tooltip & popovers
  $('[data-toggle="tooltip"]').tooltip()
  $('[data-toggle="popover"]').popover()

  // page scroll
  $('a.page-scroll').bind('click', function (event) {
    const $anchor = $(this)
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top - 20
    }, 1000)
    event.preventDefault()
  })

  // slick slider
  $('.slick-about').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: false
  })

  // toggle scroll menu
  let scrollTop = 0
  $(window).scroll(function () {
    const scroll = $(window).scrollTop()
    // adjust menu background
    if (scroll > 80) {
      if (scroll > scrollTop) {
        $('.smart-scroll').addClass('scrolling').removeClass('up')
      } else {
        $('.smart-scroll').addClass('up')
      }
    } else {
      // remove if scroll = scrollTop
      // $('.smart-scroll').removeClass('scrolling').removeClass('up');
    }

    scrollTop = scroll

    // adjust scroll to top
    if (scroll >= 600) {
      $('.scroll-top').addClass('active')
    } else {
      $('.scroll-top').removeClass('active')
    }
    return false
  })

  // scroll top top
  $('.scroll-top').click(function () {
    $('html, body').stop().animate({
      scrollTop: 0
    }, 1000)
  })

  // Stuff
  $('.dashboard').click(function () {
    window.location.href = '/dashboard'
  })
  /** Theme switcher  */
  $('.switcher-trigger').click(function () {
    $('.switcher-wrap').toggleClass('active')
  })
  $('.color-switcher ul li').click(function () {
    const color = $(this).attr('data-color')
    $('#theme-color').attr('href', `https://kingdoms.reals.tech/assets/css/${color}.css`)
    $('.color-switcher ul li').removeClass('active')
    $(this).addClass('active')
    document.cookie = `color=${color}`
  })
})
